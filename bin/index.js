import TelegramAPI from "node-telegram-bot-api";
import { token } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import { createAnswer, createAnswerForCallback } from "../src/index.js";

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
    const cliId = msg.from.id;
    const text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const time = msg.date;
    const doc = msg.document;

    try {
      switch (true) {
        case text === "/start":
          await bot.sendMessage(chatId, answers.textStart, msgoption);
          break;
        case text === "/admin":
          await bot.sendMessage(chatId, answers.textStart, msgoption);
          break;
        default:
          let thumbPath;
          if (msg.document !== undefined) {
            thumbPath = await bot.getFileLink(msg.document.file_id);
          }
          const answer = await createAnswer(text, cliId, doc, thumbPath);
          await bot.sendMessage(chatId, answer.text, answer.option);
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });

  bot.on("callback_query", async (msg) => {
    const cliId = msg.from.id;
    const text = msg.data;
    const chatId = msg.message.chat.id;
    //   const username = msg.from.username;
    //   const time = msg.date;
    //   let thumbPath;
    //   if (msg.document !== undefined) {
    //     thumbPath = await bot.getFileLink(msg.document.file_id);
    //   }
    try {
      const answer = await createAnswerForCallback(text, cliId);
      await bot.sendMessage(chatId, answer.text, answer.option);
      return;
    } catch (error) {
      await bot.sendMessage(chatId, "problem with callback_query", msgoption);
      return;
    }
  });
};

start();
