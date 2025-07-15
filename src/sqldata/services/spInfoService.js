import { ToolSPmatNo } from "../models.js";
import { Op } from "sequelize";
import botoptions from "../../botoptions.js";
import toolService from "./toolService.js";
import { SP_ServiceURL } from "../../config.js";
export default async function spInfoService(spmatNo) {
  let result = {};

  try {
    const sp_search = await fetch(SP_ServiceURL + "/" + spmatNo, {
      method: "GET",
    });
    const spinfo = await sp_search.json();

    if (spinfo) {
      const { name, char, price, warehousestatus, spmatNo } = spinfo;
      const text = `${spmatNo}\n${name}\n
⚒️ Характеристика: ${char || "Нет информации"}\n
💵 Рекомендованная цена: ${price || "Нет информации"} руб\n
🏠 Склад: ${warehousestatus || "Нет информации"}`;
      result.spinfoanswer = { text, option: botoptions.defaultoption };
      const toolsByspmas = await ToolSPmatNo.findAll({
        where: {
          [Op.or]: [{ spmatNo: spmatNo }],
        },
      });
      const tools_inline_keyboard_promise = toolsByspmas.map(async (el) => {
        const { tool_code } = el.dataValues;
        return toolService.toolInfo(tool_code).then((res) => {
          if (!res[0]) {
            return [
              {
                text: `${tool_code} - нет схемы`,
                callback_data: `${tool_code}`,
              },
            ];
          }
          return [
            {
              text: res[0].dataValues.tool_name.slice(0, -4),
              callback_data: tool_code,
            },
          ];
        });
      });

      const analogmas_ = await fetch(SP_ServiceURL + "/analog/" + spmatNo, {
        method: "GET",
      });
      const analogmas = await analogmas_.json();

      const analog_inline_keyboard_promise = analogmas.map((el) => {
        return [{ text: el.spmatNoanalog, callback_data: el.spmatNoanalog }];
      });

      const tools_inline_keyboard = await Promise.all(
        tools_inline_keyboard_promise
      );
      const analog_inline_keyboard = await Promise.all(
        analog_inline_keyboard_promise
      );
      result.toolsForSP = {
        text: "Вы можете выбрать инструмент",
        option: tools_inline_keyboard,
      };
      result.analogSP = {
        text: "Есть аналоги 🔁",
        option: analog_inline_keyboard,
      };
    } else {
      result.noInfo = {
        text: "Информации по ЗЧ не найдено((",
        option: botoptions.defaultoption,
      };
    }
    return result;
  } catch (error) {
    return ({noInfo :{
      text: "Информации по ЗЧ не найдено((",
      option: botoptions.defaultoption,
    }});
  }
}
