import TelegramAPI from "node-telegram-bot-api";
import { token } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import cliroutes from "../src/utils/cliroutes.js";

const msgoption = {
  parse_mode: "Markdown",
  reply_markup: {
    resize_keyboard: true,
  },
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/admin", description: "Admin" },
  ]);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const time = msg.date;
    try {
      switch (true) {
        case text === "/start":
          await bot.sendMessage(chatId, answers.textStart, msgoption);
          break;
        case text === "/admin":
          await bot.sendMessage(chatId, answers.textStart, msgoption);
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });
};

start();
