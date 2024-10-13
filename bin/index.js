import TelegramAPI from "node-telegram-bot-api";
import { token } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import { createAnswer, createAnswerForCallback } from "../src/index.js";
import path from "path";
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
          console.log(answer);
          try {
            console.log(answer);
            if (Array.isArray(answer)) {
              const prom = answer.map(async (el) => {
                if (el.option.parse_mode) {
                  await bot.sendMessage(chatId, el.text, el.option);
                } else {
                  if (el.option.length === 0) {
                    return;
                  }
                  await bot.sendMessage(chatId, el.text, {
                    reply_markup: {
                      inline_keyboard: el.option,
                    },
                  });
                }
              });
              Promise.all(prom);
            } else {
              await bot.sendMessage(
                chatId,
                answer.text.tool_name,
                answer.option
              );
              if (answer.text.tool_path) {
                await bot.sendDocument(
                  chatId,
                  path.join(process.cwd(), answer.text.tool_path)
                );
              }
            }
          } catch {
            await bot.sendMessage(chatId, answer.text, answer.option);
          }
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
    try {
      const answer = await createAnswerForCallback(text, cliId);
      console.log(answer);
      if (Array.isArray(answer)) {
        const prom = answer.map(async (el) => {
          if (el.option.parse_mode) {
            await bot.sendMessage(chatId, el.text, el.option);
          } else {
            if (el.option.length === 0) {
              return;
            }
            await bot.sendMessage(chatId, el.text, {
              reply_markup: {
                inline_keyboard: el.option,
              },
            });
          }
        });
        Promise.all(prom);
        Promise.all(prom);
      } else {
        await bot.sendMessage(
          chatId,
          answer.text.tool_name || answer.text,
          answer.option
        );
        if (answer.text.tool_path) {
          await bot.sendDocument(
            chatId,
            path.join(process.cwd(), answer.text.tool_path)
          );
        }
      }
    } catch (error) {
      await bot.sendMessage(chatId, "problem with callback_query", msgoption);
      return;
    }
  });
};

start();
