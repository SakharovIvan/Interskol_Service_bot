//import { ToolPaths } from "../models.js";
//import { Op } from "sequelize";
//import botoptions from "../../botoptions.js";
//
//class toolService {
//  async toolInfo(tool_code) {
//    return await ToolPaths.findAll({
//      where: {
//        tool_code: { [Op.like]: `${tool_code}%` || null },
//      },
//      order: [["tool_code", "ASC"]],
//    });
//  }
//
//  async toolSearch(tool_code) {
//    const bread = ["-", ".", "/", "/", " "];
//    const res = tool_code.split(/(\.|-|\/|\/| )/);
//    const indexOfBread = res
//      .map((el) => {
//        if (bread.includes(el)) {
//          return res.indexOf(el);
//        }
//        return;
//      })
//      .filter((el) => el !== undefined);
//    const result = res
//      .filter((el) => !indexOfBread.includes(res.indexOf(el)))
//      .map((el) => el.toUpperCase())
//      .map((el) => {
//        return { tool_name: { [Op.like]: `%${el}%` } };
//      });
//    const list = await ToolPaths.findAll({
//      where: {
//        [Op.and]: result,
//      },
//      order: [["tool_code", "ASC"]],
//    });
//    return list;
//  }
//
//  async toolSearchAnswer(tool_code) {
//    let result = {};
//
//    const toolsByName = await this.toolSearch(tool_code);
//    if (toolsByName[0]) {
//      const toolsByName_inline_keyboard_promise = toolsByName.map(
//        async (el) => {
//          const { tool_code } = el.dataValues;
//          return this.toolInfo(tool_code).then((res) => {
//            if (!res[0]) {
//              return [
//                { text: `${tool_code} - нет схемы`, callback_data: tool_code },
//              ];
//            }
//            return [
//              {
//                text: res[0].dataValues.tool_name.slice(0, -4),
//                callback_data: tool_code,
//              },
//            ];
//          });
//        }
//      );
//      const toolsByName_inline_keyboard = await Promise.all(
//        toolsByName_inline_keyboard_promise
//      );
//      result.toolsByName = {
//        text: "Найдены инструменты по наименованию",
//        option: toolsByName_inline_keyboard,
//      };
//    } else {
//      result.noInfo = {
//        text: "Информации инструменты по наименованию не найдено((",
//        option: botoptions.defaultoption,
//      };
//    }
//    return result;
//  }
//
//  async toolAnswer(code) {
//    let result = {};
//
//    const toolanswer = await this.toolInfo(code);
//    if (toolanswer[0]) {
//      const tools_modif_inline_keyboard_promise = toolanswer.map((el) => {
//        const { tool_code } = el.dataValues;
//        return this.toolInfo(tool_code).then((res) => {
//          if (!res[0]) {
//            return [
//              {
//                text: `${tool_code} - нет схемы`,
//                callback_data: `${tool_code}`,
//              },
//            ];
//          }
//          return [
//            {
//              text: res[0].dataValues.tool_name.slice(0, -4),
//              callback_data: tool_code,
//            },
//          ];
//        });
//      });
//
//      const tools_modif_inline_keyboard = await Promise.all(
//        tools_modif_inline_keyboard_promise
//      );
//
//      result.toolinfoanswer = {
//        text: toolanswer[0].dataValues,
//        option: tools_modif_inline_keyboard,
//      };
//    } else {
//      result.noInfo = {
//        text: "Информации по инструменту не найдено((",
//        option: botoptions.defaultoption,
//      };
//    }
//
//    return result;
//  }
//}
//
//export default new toolService();
