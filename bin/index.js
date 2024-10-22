import TelegramAPI from "node-telegram-bot-api";
import { token } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import { createAnswer, createAnswerForCallback } from "../src/index.js";
import path from "path";
import fs from "fs";
import botoptions from "../src/botoptions.js";
import paginatemsg from "../src/utils/paginatemsg.js";
const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
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
          const stream = fs.createReadStream(
            "//home/petProjects/Interskol_Service_bot/public/images/INTERSOL_logo.jpg"
          );
          await bot.sendPhoto(chatId, stream);
          await bot.sendMessage(
            chatId,
            answers.textStart,
            botoptions.defaultoption
          );
          break;
        case text === "/admin":
          await bot.sendMessage(
            chatId,
            answers.textAdminPanel,
            botoptions.admin
          );
          break;
        default:
          let thumbPath;
          if (msg.document !== undefined) {
            thumbPath = await bot.getFileLink(msg.document.file_id);
          }
          const answer = await createAnswer(text, cliId, doc, thumbPath);
          try {
            if (Array.isArray(answer)) {
              await bot.sendMessage(chatId, answer[0].text, answer[0].option);
              const analog_msg_id = await bot.sendMessage(chatId, "analog");
              setTimeout(async () => {
                if (answer[2].option.length === 0) {
                  return await bot.deleteMessage(
                    analog_msg_id.chat.id,
                    analog_msg_id.message_id
                  );
                }
                await bot.editMessageText(answer[2].text, {
                  chat_id: analog_msg_id.chat.id,
                  message_id: analog_msg_id.message_id,
                  reply_markup: {
                    inline_keyboard: paginatemsg(
                      answer[2].option,
                      analog_msg_id.message_id,
                      text,
                      "analog"
                    ),
                  },
                });
              }, 0);
              const tools_msg_id = await bot.sendMessage(chatId, "toolsBySP");
              setTimeout(async () => {
                if (answer[1].option.length === 0) {
                  return await bot.deleteMessage(
                    tools_msg_id.chat.id,
                    tools_msg_id.message_id
                  );
                }
                await bot.editMessageText(answer[1].text, {
                  chat_id: tools_msg_id.chat.id,
                  message_id: tools_msg_id.message_id,
                  reply_markup: {
                    inline_keyboard: paginatemsg(
                      answer[1].option,
                      tools_msg_id.message_id,
                      text,
                      "toolsBySP"
                    ),
                  },
                });
              }, 0);
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
      const cbtext = text.split("%");
      const answer = await createAnswerForCallback(cbtext[2] || cbtext[0]);
      if (Array.isArray(answer)) {
        let mas;
        switch (cbtext[1]) {
          case "toolsBySP":
            mas = answer[1];
            break;
          case "analog":
            mas = answer[2];
            break;
        }
        await bot.editMessageText(mas.text, {
          chat_id: chatId,
          message_id: cbtext[0],
          reply_markup: {
            inline_keyboard: paginatemsg(
              mas.option,
              cbtext[0],
              cbtext[2],
              cbtext[1],
              Number(cbtext[3])
            ),
          },
        });
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
      await bot.sendMessage(
        chatId,
        "problem with callback_query",
        botoptions.defaultoption
      );
      return;
    }
  });
};

start();
