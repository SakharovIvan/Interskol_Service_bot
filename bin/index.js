import TelegramAPI from "node-telegram-bot-api";
import { token } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import path from "path";
import fs from "fs";
import botoptions from "../src/botoptions.js";
import {
  deletefilefromTemp,
} from "../src/utils/downloadfilefrombot.js";
import { Answer } from "../src/models/answer.js";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);


async function sent_answer(bot, answer) {
  if (answer.sp_view) {
    await bot.sendMessage(
      answer.chatId,
      answer.sp_view.text,
      answer.sp_view.option
    );
  }
  if (answer.analog_view) {
    await bot.sendMessage(
      answer.chatId,
      answer.analog_view.text,
      {
        reply_markup: {
          inline_keyboard: answer.analog_view.inline_keyboard
        }
      }
    );
  }
}

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    {
      command: "/map",
      description: "Список авторизивоанных сервисных центров ",
    },
  ]);
  bot.on("message", async (msg) => {
    let text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const group = msg.chat.type === "supergroup" ? true : false;

    if (!text) {
      return;
    }
    if (group) {
      if (!text?.split("").includes(" ")) {
        return;
      }
      if (text.split(" ")[0] === "@INTERSKOL_Service_Info_bot") {
        if (msg.entities) {
          text = text.split(" ")[1];
        } else {
          return;
        }
      } else {
        return;
      }
    }
    try {
      switch (true) {
        case text === "/start":
          const stream = fs.createReadStream(
            path.join(__filename, "/public/images/INTERSOL_logo.jpg")
          );
          await bot.sendPhoto(chatId, stream);
          await bot.sendMessage(
            chatId,
            answers.textStart,
            botoptions.defaultoption
          );
          break;
        case text === "/map":
          await bot.sendMessage(
            chatId,
            answers.textMap,
            botoptions.defaultoption
          );
          break;
        default:
          const answer = new Answer({ msg: text, cb: false, chatId, username });
          await answer.init();
          await sent_answer(bot, answer)
          break;
      }
    } catch (err) {
      console.log(err);
    }
  });

  bot.on("callback_query", async (msg) => {
    const text = msg.data;
    const chatId = msg.message.chat.id;
    const username = msg.from.username;

    try {
      const answer = new Answer({ msg: text, cb: true, chatId, username });
      await answer.init()
      await sent_answer(bot, answer)

    } catch (error) {
      console.log(error)
    }


  });
};

start();
