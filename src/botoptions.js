export default {
  defaultoption: {
    parse_mode: "Markdown",
    reply_markup: {
      resize_keyboard: true,
    },
  },
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
