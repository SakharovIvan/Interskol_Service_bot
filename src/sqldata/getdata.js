import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import { Op } from "sequelize";
import botoptions from "../botoptions.js";

const getInfofromBd = async (climsg) => {
  var answer = [];
  const toolinfo = async (tool) =>
    await ToolPaths.findAll({
      where: {
        tool_code: Number(tool) || null,
      },
    });

  const toolinfoByname = async (tool) =>
    await ToolPaths.findAll({
      where: {
        tool_name: { [Op.like]: `%${tool}%` },
      },
    });

  const toolsByName = await toolinfoByname(climsg);
  const toolanswer = await toolinfo(climsg);
  const spinfo = await SPmatNo.findAll({
    where: {
      [Op.or]: [{ spmatNo: climsg }],
    },
  });

  if (spinfo[0]) {
    const { name, char, price, warehousestatus, spmatNo } =
      spinfo[0].dataValues;
    const text = `${spmatNo}\n${name}\n
⚒️ Характеристика: ${char || "Нет информации"}\n
💵 Цена: ${price || "Нет информации"} руб\n
🏠 Склад: ${warehousestatus || "Нет информации"}`;
    answer.push({ text, option: botoptions.defaultoption });
    const toolsByspmas = await ToolSPmatNo.findAll({
      where: {
        [Op.or]: [{ spmatNo: climsg }],
      },
    });
    const tools_inline_keyboard_promise = toolsByspmas.map(async (el) => {
      const { tool_code } = el.dataValues;
      return toolinfo(tool_code).then((res) => {
        if (!res[0]) {
          return [
            { text: `${tool_code} - нет схемы`, callback_data: tool_code },
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

    const analogmas = await SPanalog.findAll({
      where: {
        spmatNo: climsg,
      },
    });

    const analog_inline_keyboard_promise = analogmas.map((el) => {
      return [{ text: el.spmatNoanalog, callback_data: el.spmatNoanalog }];
    });

    const tools_inline_keyboard = await Promise.all(
      tools_inline_keyboard_promise
    );
    const analog_inline_keyboard = await Promise.all(
      analog_inline_keyboard_promise
    );

    answer.push(
      {
        text: "Вы можете выбрать инструмент",
        option: tools_inline_keyboard,
      },
      { text: "Есть аналоги 🔁", option: analog_inline_keyboard }
    );
  } else if (toolanswer[0]) {
    answer = {
      text: toolanswer[0].dataValues,
      option: botoptions.defaultoption,
    };
  } else if (toolsByName[0]) {
    console.log(toolsByName);
    answer = { text: "found tools by name", option: botoptions.defaultoption };
  } else {
    answer = { text: "there is no info", option: botoptions.defaultoption };
  }

  //{ text:tooldata[0].dataValues, option: botoptions.defaultoption };

  return answer;
};

export { getInfofromBd };
