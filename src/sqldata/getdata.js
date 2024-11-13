import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import { Op } from "sequelize";
import botoptions from "../botoptions.js";

const getInfofromBd = async (climsg) => {
  let result = {};
  const toolinfo = async (tool) =>
    await ToolPaths.findAll({
      where: {
        tool_code: Number(tool) || null,
      },
    });

  const toolinfoByname = async (tool) => {
    const bread = ["-", ".", "/", "/", " "];
    const res = tool.split(/(\.|-|\/|\/| )/);
    const indexOfBread = res
      .map((el) => {
        if (bread.includes(el)) {
          return res.indexOf(el);
        }
        return;
      })
      .filter((el) => el !== undefined);
    const result = res
      .filter((el) => !indexOfBread.includes(res.indexOf(el)))
      .map((el) => el.toUpperCase())
      .map((el) => {
        return { tool_name: { [Op.like]: `%${el}%` } };
      });
    return await ToolPaths.findAll({
      where: {
        [Op.and]: result,
      },
    });
  };

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
💵 Рекомендованная цена: ${price || "Нет информации"} руб\n
🏠 Склад: ${warehousestatus || "Нет информации"}`;
    result.spinfoanswer = { text, option: botoptions.defaultoption };
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
    result.toolsForSP = {
      text: "Вы можете выбрать инструмент",
      option: tools_inline_keyboard,
    };
    result.analogSP = {
      text: "Есть аналоги 🔁",
      option: analog_inline_keyboard,
    };
  } else if (toolanswer[0]) {
    result.toolinfoanswer = {
      text: toolanswer[0].dataValues,
      option: botoptions.defaultoption,
    };
  } else if (toolsByName[0]) {
    const toolsByName_inline_keyboard_promise = toolsByName.map(async (el) => {
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
    const toolsByName_inline_keyboard = await Promise.all(
      toolsByName_inline_keyboard_promise
    );
    result.toolsByName = {
      text: "Найдены инструменты по наименованию",
      option: toolsByName_inline_keyboard,
    };
  } else {
    result.noImfo = {
      text: "Информации не найдено((",
      option: botoptions.defaultoption,
    };
  }
  return result;
};

export { getInfofromBd };
