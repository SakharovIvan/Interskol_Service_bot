import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import { Op } from "sequelize";
import botoptions from "../botoptions.js";
import spInfoService from "./services/spInfoService.js";
import toolService from "./services/toolService.js";
const getInfofromBd = async (climsg) => {
  let toolsByName;
  let toolanswer;
  let spinfo;
  let result;
  toolsByName = await toolService.toolSearchAnswer(climsg);
  toolanswer = await toolService.toolAnswer(climsg);
  spinfo = await spInfoService(climsg);
  const tool = toolanswer.noInfo ? toolsByName : toolanswer;
  result = { ...tool, ...spinfo };
  if (toolsByName.noInfo && toolanswer.noInfo && spinfo.noInfo) {
    return {
      noInfo: {
        text: "Информации не найдено((",
        option: botoptions.defaultoption,
      },
    };
  }
  const { noInfo, ...res } = result;
  return res;
};

export { getInfofromBd };
