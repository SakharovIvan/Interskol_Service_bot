import botoptions from "../botoptions.js";
import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import path from "path";
import { Op } from "sequelize";
import SPmatNoDto from "../dtos/sparepartdto.js";
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
        const { tool_name } = data;
        const tool_path = "/public/toolPDF/" + tool_name;
        ToolPaths.create({ ...data, tool_path });
        return {
          text: `${code} created\nplease import excel`,
          option: botoptions.defaultoption,
        };
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        text: `some problem with updateToolByCode`,
        option: botoptions.defaultoption,
      };
    });

  return answer;
};

const updateToolSPmatNo = async (code, data) => {
  try {
    const tool_code_to_destroy = [];
    const newdata = data.map((info) => {
      if (!tool_code_to_destroy.includes(info.tool_code) && info.tool_code) {
        tool_code_to_destroy.push(info.tool_code);
      }
      const tool_code = info.tool_code === undefined ? code : info.tool_code;
      return new SPmatNoDto(info, tool_code);
    });
    if (tool_code_to_destroy.length === 0) {
      tool_code_to_destroy.push(code);
    }
    try {
      const delete_promise = tool_code_to_destroy.map((tool_code) => {
        ToolSPmatNo.destroy({
          where: { tool_code: { [Op.like]: String(tool_code) } },
        });
      });

      const answer = Promise.all(delete_promise)
        .then(() => {
          ToolSPmatNo.bulkCreate(newdata);
        })
        .then(() => {
          const promises = newdata.map((el) => {
            SPmatNo.findOne({ where: { spmatNo: el.spmatNo } })
              .then(function (obj) {
                if (obj) return obj.update(el);
                return SPmatNo.create(el);
              })
              .catch((err) => {
                return {
                  text: `${tool_code_to_destroy} ${JSON.stringify(err)} Error`,
                  option: botoptions.defaultoption,
                };
              });
          });
          return Promise.all(promises).then(() => {
            return {
              text: `${tool_code_to_destroy} updated`,
              option: botoptions.defaultoption,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          return {
            text: `${tool_code_to_destroy} problem with update`,
            option: botoptions.defaultoption,
          };
        });
      return answer;
    } catch (error) {
      return { text: `${error}`, option: botoptions.defaultoption };
    }
  } catch (error) {
    return { text: `${error}`, option: botoptions.defaultoption };
  }
};

const updatewarehouse = async (data) => {
  try {
    const res = await fetch("localhost:3000/spareparts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.status === 200) {
      console.log("sucess updated");
      return {
        text: `Warehouse updated`,
        option: botoptions.defaultoption,
      };
    } else {
      console.log(res);
      return {
        text: JSON.stringify(res),
        option: botoptions.defaultoption,
      };
    }
  } catch (error) {
    console.log(error);
    console.log(data);

    return {
      text: `Some problem with warehouse update`,
      option: botoptions.defaultoption,
    };
  }
};

const updateanalog = async (data) => {
  try {
    await SPanalog.destroy({ truncate: true });
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
