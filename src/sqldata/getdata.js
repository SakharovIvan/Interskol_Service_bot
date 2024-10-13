import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import { Op } from "sequelize";
import botoptions from "../botoptions.js";
import { all } from "axios";

const getInfofromBd = async (climsg, page = 0) => {
  let answer = [];

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

  const toolanswer = await toolinfo(climsg);
  const spinfo = await SPmatNo.findAll({
    where: {
      [Op.or]: [{ spmatNo: climsg }],
    },
  });

  if (spinfo[0]) {
    const { name, char, price, warehousestatus } = spinfo[0].dataValues;
    const text = `${name}\n
⚒️ Характеристика: ${char || "Нет информации"}\n
💵 Цена: ${price || "Нет информации"} руб\n
🏠 Склад: ${warehousestatus || "Нет информации"}`;
    answer.push({ text, option: botoptions.defaultoption });
    const toolsByspmas = await ToolSPmatNo.findAll({
      where: {
        [Op.or]: [{ spmatNo: climsg }],
      },
      limit: 7,
      offset: page * 7,
    });
    const tools_inline_keyboard_promise = toolsByspmas.map(async (el) => {
      const { tool_code } = el.dataValues;
      return toolinfo(tool_code).then((res) => {
        return [
          { text: res[0].dataValues.tool_name, callback_data: tool_code },
        ];
      });
    });

    const analogmas = await SPanalog.findAll({
      where: {
        [Op.or]: [{ spmatNo: climsg }],
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
    if (tools_inline_keyboard.length > 7) {
      tools_inline_keyboard.push(
        [
          { text: "prev", callback_data: `${climsg}%${page - 1}` },
          { text: "next", callback_data: `${climsg}%${page + 1}` },
        ],
        [{ text: "all", callback_data: `${climsg}%${100}` }]
      );
    }
    console.log(tools_inline_keyboard.length);
    answer.push(
      { text: "Tools", option: tools_inline_keyboard },
      { text: "analog", option: analog_inline_keyboard }
    );
  } else {
    if (toolanswer[0]) {
      answer = {
        text: toolanswer[0].dataValues,
        option: botoptions.defaultoption,
      };
    } else {
      answer = { text: "there is no info", option: botoptions.defaultoption };
    }
  }
  //{ text:tooldata[0].dataValues, option: botoptions.defaultoption };

  return answer;
};

export { getInfofromBd };
