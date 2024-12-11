export default {
  defaultoption: {
    reply_markup: {
      resize_keyboard: true,
    },
  },
  admin: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Шаблоны для импорта EXCEL склад - цены",
            callback_data: "Excel_template",
          },
        ],
        [
          {
            text: "Отправить БД на почту",
            callback_data: "email_BD",
          },
          {
            text: "Отправить Логи на почту",
            callback_data: "Excel_BD_MessageLog",
          },
        ],
        [
          {
            text: "Шаблон для импорта аналогов",
            callback_data: "Excel_analog_template",
          },
        ],
        [
          {
            text: "Шаблон для импорта Списка зч к инструменту",
            callback_data: "Excel_tool-sp_template",
          },
        ],
      ],
    },
  },
  adminBDtopost: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "ToolSPmatNo",
            callback_data: "Excel_BD_ToolSPmatNo",
          },
        ],
        [
          {
            text: "SPmatNo",
            callback_data: "Excel_BD_SPmatNo",
          },
        ],
      ],
    },
  },
  erros: {},
  needcommitToolChanges: {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Yes", callback_data: "commitToolChanges-true" },
          { text: "❌ No", callback_data: "commitToolChanges-false" },
        ],
      ],
    },
  },
};
