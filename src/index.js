import cliroutes from "./utils/cliroutes.js";
import { getToolPathInfo } from "./sqldata/getdata.js";
import {
  downloadfile,
  movefiletomaindir,
  deletefilefromTemp,
} from "./utils/downloadfilefrombot.js";
import messageType from "./utils/messagetype.js";
import { adminID } from "./config.js";
import { updateToolByCode, updateToolSPmatNo } from "./sqldata/updatedata.js";
import botoptions from "./botoptions.js";
import fileparser from "./parsers/attachmentparser.js";
import path from "path";

let cliStatus = {};

const createAnswer = async (text, cliId, doc, link = "") => {
  const type = messageType(doc);
  let answer;
  switch (true) {
    case type === "question":
      answer = {
        text: await getToolPathInfo(Number(text)),
        option: botoptions.defaultoption,
      };
      break;
    case type === "docfile":
      const download = await downloadfile(link, doc.file_name);
      //console.log(download);
      const filepars = await fileparser(download);
      cliStatus[cliId] = { ...filepars, ...cliStatus[cliId] };
      console.log(cliStatus[cliId]);
      if (cliStatus[cliId].exceldata) {
        console.log("excel checked");
        console.log(cliStatus[cliId].exceldata);
        answer = await updateToolSPmatNo(
          cliStatus[cliId].data.tool_code,
          cliStatus[cliId].exceldata
        );
        //answer = await updateToolSPmatNo(filepars.tool, filepars.data);
      } else {
        answer = await updateToolByCode(filepars.tool, filepars.data);
      }

      // console.log(cliStatus);
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
        await updateToolByCode(tool, data, true);
        await movefiletomaindir(data.tool_path, "/public/toolPDF");
        answer = {
          text: `Import excel for tool ${tool}`,
          option: botoptions.defaultoption,
        };
        return answer;
      case text === "commitToolChanges-false":
        answer = {
          text: `work with ${status.tool} stoped`,
          option: botoptions.defaultoption,
        };
        await deletefilefromTemp(status.data.tool_path);
        return answer;
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
