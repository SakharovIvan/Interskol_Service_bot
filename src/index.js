import cliroutes from "./utils/cliroutes.js";
import { getInfofromBd } from "./sqldata/getdata.js";
import {
  downloadfile,
  movefiletomaindir,
  deletefilefromTemp,
} from "./utils/downloadfilefrombot.js";
import messageType from "./utils/messagetype.js";
import { adminID } from "./config.js";
import {
  updateToolByCode,
  updateToolSPmatNo,
  updatewarehouse,
  updateanalog,
} from "./sqldata/updatedata.js";
import botoptions from "./botoptions.js";
import fileparser from "./parsers/attachmentparser.js";
import path from "path";

let cliStatus = {};

const createAnswer = async (text, cliId, doc, link = "") => {
  const type = messageType(doc);
  var answer;
  switch (true) {
    case type === "question":
      answer = await getInfofromBd(text);
      break;
    case type === "docfile" && adminID.includes(cliId):
      const download = await downloadfile(link, doc.file_name);
      const filepars = await fileparser(download);
      cliStatus[cliId] = { ...cliStatus[cliId], ...filepars };
      switch (cliStatus[cliId].filetype) {
        case "toolpdf":
          answer = await updateToolByCode(filepars.tool, filepars.data);
          if (
            answer.text === `${filepars.tool} created\nplease import excel` ||
            answer.text === `${filepars.tool} updated\nplease import excel`
          ) {
            await movefiletomaindir(
              filepars.data.tool_path,
              "/public/toolPDF",
              true
            );
          }
          break;
        case "toolsp":
          try {
            answer = await updateToolSPmatNo(
              cliStatus[cliId].data ? cliStatus[cliId].data.tool_code : null,
              cliStatus[cliId].exceldata
            );
            await deletefilefromTemp(cliStatus[cliId].filepath);
          } catch (error) {
            console.log(error);
            answer = {
              text: `Some problem with file toolsp update\n${error.name}`,
              option: botoptions.defaultoption,
            };
          }
          break;
        case "warehousestatus":
          answer = await updatewarehouse(cliStatus[cliId].exceldata);
          await deletefilefromTemp(cliStatus[cliId].filepath);
          break;
        case "analog":
          answer = await updateanalog(cliStatus[cliId].exceldata);
          await deletefilefromTemp(cliStatus[cliId].filepath);
          break;
      }
      break;
    default:
      answer = {
        text: "dont understand you",
        option: botoptions.defaultoption,
      };
  }
  return answer;
};

const createAnswerForCallback = async (text, cliId) => {
  let answer;
  try {
    const status = cliStatus[cliId];
    switch (true) {
      case text === "commitToolChanges-true":
        const { tool, data } = status;
        console.log(tool, data);
        answer = await updateToolByCode(tool, data, true);
        await movefiletomaindir(data.tool_path, "/public/toolPDF", true);
        return answer;
      case text === "commitToolChanges-false":
        answer = {
          text: `work with ${status.tool} stoped`,
          option: botoptions.defaultoption,
        };
        await deletefilefromTemp(status.data.tool_path);
        return answer;
      default:
        answer = await getInfofromBd(text);
    }
  } catch (error) {
    console.log(error);
    answer = {
      text: `work stoped`,
      option: botoptions.defaultoption,
    };
  }
  return answer;
};

export { createAnswer, createAnswerForCallback };
