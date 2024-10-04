import botoptions from "../botoptions.js";
import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import path from "path";

const updateToolByCode = async (code, data, commit = false) => {
  const answer = ToolPaths.findOne({ where: { tool_code: code } })
    .then((obj) => {
      if (obj) {
        if (commit) {
          obj.update(data);
          return {
            text: `${code} updated`,
            option: botoptions.defaultoption,
          };
        }
        return {
          text: `Need commit, update ${code}?`,
          option: botoptions.needcommitToolChanges,
        };
      } else {
        ToolPaths.create(data);
        return { text: `${code} created`, option: botoptions.defaultoption };
      }
    })
    .catch(() => {
      return {
        text: `some problem with updateToolByCode`,
        option: botoptions.defaultoption,
      };
    });
  return answer;
};

const updateToolSPmatNo = async (code, data) => {
  const newdata = data.map(({ spmatNo, sppiccode, spqty }) => {
    return {
      tool_code: code,
      spmatNo,
      sppiccode,
      spqty,
    };
  });
  const answer = ToolSPmatNo.destroy({ where: { tool_code: code } })
    .then(() => {
      ToolSPmatNo.bulkCreate(newdata).then(() => {
        return { text: `${code} updated`, option: botoptions.defaultoption };
      });
    })
    .catch(() => {
      ToolSPmatNo.bulkCreate(newdata).then(() => {
        return { text: `${code} created`, option: botoptions.defaultoption };
      });
    })
    .catch(() => {
      return {
        text: `some problem with updateToolSPmatNo`,
        option: botoptions.defaultoption,
      };
    });
  return answer;
};

export { updateToolByCode, updateToolSPmatNo };
