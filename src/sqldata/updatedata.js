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
      }
      ToolPaths.create(data);
      return { text: `${code} created`, option: botoptions.defaultoption };
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
  ToolSPmatNo.destroy({ where: { tool_code: code } })
    .then(() => {
      ToolSPmatNo.create(data);
      return { text: `${code} created`, option: botoptions.defaultoption };
    })
    .catch(() => {
      return {
        text: `some problem with updateToolByCode`,
        option: botoptions.defaultoption,
      };
    });
};

export { updateToolByCode, updateToolSPmatNo };
