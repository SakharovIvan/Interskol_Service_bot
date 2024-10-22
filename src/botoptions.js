export default {
  defaultoption: {
    parse_mode: "Markdown",
    reply_markup: {
      resize_keyboard: true,
    },
  },
  admin: {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Шаблоны для импорта EXCEL ",
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
            callback_data: "email_log_BD",
          },
        ],
        [
          {
            text: "Личный кабинет",
            callback_data: "LS",
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
