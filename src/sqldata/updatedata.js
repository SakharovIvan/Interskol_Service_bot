import botoptions from "../botoptions.js";
import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import path from "path";

const updateToolByCode = async (code, data, commit = false) => {
  const answer = ToolPaths.findOne({ where: { tool_code: code } })
    .then((obj) => {
      if (obj) {
        if (commit) {
          const { tool_code, tool_name } = data;
          const tool_path = "/public/toolPDF/" + tool_name;
          obj.update({ tool_code, tool_name, tool_path });
          return {
            text: `${code} updated\nplease import excel`,
            option: botoptions.defaultoption,
          };
        }
        return {
          text: `Need commit, update ${code}?`,
          option: botoptions.needcommitToolChanges,
        };
      } else {
        ToolPaths.create(data);
        return {
          text: `${code} created\nplease import excel`,
          option: botoptions.defaultoption,
        };
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
  console.log(data);
  const newdata = data.map((info) => {
    return {
      tool_code: code,
      ...info,
    };
  });
  try {
    const answer = ToolSPmatNo.destroy({ where: { tool_code: code } })
      .then(() => {
        ToolSPmatNo.bulkCreate(newdata);
      })
      .then(() => {
        const promises = newdata.map((el) => {
          SPmatNo.findOne({ where: { spmatNo: el.spmatNo } }).then(
            function (obj) {
              if (obj) return obj.update(el);
              return SPmatNo.create(el);
            }
          );
        });
        return Promise.all(promises).then(() => {
          return {
            text: `${code} updated`,
            option: botoptions.defaultoption,
          };
        });
      })
      .catch(() => {
        ToolSPmatNo.bulkCreate(newdata);
        return { text: `${code} created`, option: botoptions.defaultoption };
      });
    return answer;
  } catch (error) {
    return { text: `${error}`, option: botoptions.defaultoption };
  }
};

const updatewarehouse = async (data) => {
  try {
    const promises = data.map((el) => {
      SPmatNo.findOne({ where: { spmatNo: el.spmatNo } }).then(function (obj) {
        if (obj) return obj.update(el);
        return SPmatNo.create(el);
      });
    });
    return Promise.all(promises).then(() => {
      return {
        text: `Warehouse updated`,
        option: botoptions.defaultoption,
      };
    });
  } catch (error) {
    return {
      text: `Some problem with warehouse update`,
      option: botoptions.defaultoption,
    };
  }
};

const updateanalog = async (data) => {
  try {
    await SPanalog.bulkCreate(data);
    return {
      text: `Analog updated`,
      option: botoptions.defaultoption,
    };
  } catch (error) {
    return {
      text: `Some problem with Analog update`,
      option: botoptions.defaultoption,
    };
  }
};

export { updateToolByCode, updateToolSPmatNo, updatewarehouse, updateanalog };
