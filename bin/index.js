import TelegramAPI from "node-telegram-bot-api";
import { token, SchemeServiceURL } from "../src/config.js";
const bot = new TelegramAPI(token, { polling: true });
import answers from "../public/answers.js";
import { createAnswer, createAnswerForCallback } from "../src/index.js";
import path from "path";
import fs from "fs";
import botoptions from "../src/botoptions.js";
import paginatemsg from "../src/utils/paginatemsg.js";
import { MessageLog } from "../src/sqldata/models.js";
import {
  downloadfile,
  deletefilefromTemp,
} from "../src/utils/downloadfilefrombot.js";
const __filename = process.cwd();
const __dirname = path.dirname(__filename);

const sendMsg = async (answer, chatId, text, page, msgid, bd) => {
  try {
    if (answer.spinfoanswer && bd === undefined) {
      await bot.sendMessage(chatId, answer.spinfoanswer.text);
    }
  } catch (error) {
    console.log(1);
  }
  try {
    if (answer.analogSP && (bd === undefined || bd === "analog")) {
      const analog_msg_id =
        page === undefined ? await bot.sendMessage(chatId, "analog") : {};
      setTimeout(async () => {
        if (answer.analogSP.option.length === 0) {
          return await bot.deleteMessage(chatId, analog_msg_id.message_id);
        }
        await bot.editMessageText(answer.analogSP.text, {
          chat_id: chatId,
          message_id: analog_msg_id.message_id || msgid,
          reply_markup: {
            inline_keyboard: paginatemsg(
              answer.analogSP.option,
              analog_msg_id.message_id || msgid,
              text,
              "analog",
              page
            ),
          },
        });
      }, 0);
    }
  } catch (error) {
    console.log(2);
  }
  try {
    if (answer.toolsForSP && (bd === undefined || bd === "toolsBySP")) {
      const tools_msg_id =
        page === undefined ? await bot.sendMessage(chatId, "toolsBySP") : {};

      setTimeout(async () => {
        if (answer.toolsForSP.option.length === 0) {
          return await bot.deleteMessage(chatId, tools_msg_id.message_id);
        }
        await bot.editMessageText(answer.toolsForSP.text, {
          chat_id: chatId,
          message_id: tools_msg_id.message_id || msgid,
          reply_markup: {
            inline_keyboard: paginatemsg(
              answer.toolsForSP.option,
              tools_msg_id.message_id || msgid,
              text,
              "toolsBySP",
              page
            ),
          },
        });
      }, 0);
    }
  } catch (error) {
    console.log(3);
  }
  try {
    if (answer.toolsByName && (bd === undefined || bd === "toolsbyName")) {
      const toolsbyname_msg_id =
        page === undefined ? await bot.sendMessage(chatId, "toolsbyName") : {};
      setTimeout(async () => {
        if (answer.toolsByName.option.length === 0) {
          return await bot.deleteMessage(chatId, toolsbyname_msg_id.message_id);
        }
        await bot.editMessageText(answer.toolsByName.text, {
          chat_id: chatId,
          message_id: toolsbyname_msg_id.message_id || msgid,
          reply_markup: {
            inline_keyboard: paginatemsg(
              answer.toolsByName.option,
              toolsbyname_msg_id.message_id || msgid,
              text,
              "toolsbyName",
              page
            ),
          },
        });
      }, 0);
    }
  } catch (error) {
    console.log(4);
  }

  if (answer.toolinfoanswer) {
    await bot.sendMessage(chatId, answer.toolinfoanswer.text.tool_name, {
      reply_markup: {
        inline_keyboard: answer.toolinfoanswer.option,
      },
    });
    if (answer.toolinfoanswer.text.tool_path) {
      try {
        const url =
          SchemeServiceURL +
          "/tool/download/pdf/" +
          answer.toolinfoanswer.text.tool_code;
        await downloadfile(url + ".pdf", answer.toolinfoanswer.text.tool_name);
        await bot.sendDocument(
          chatId,
          __dirname +
            "/Interskol_Service_bot/public/temp/" +
            answer.toolinfoanswer.text.tool_name
        );
        setTimeout(async () => {
          await deletefilefromTemp(
            "/public/temp/" + answer.toolinfoanswer.text.tool_name
          );
        }, 0);
      } catch (error) {
        await bot.sendMessage(
          chatId,
          "Не удалось загрузить взрывсхему инструмента"
        );
      }
    }
  }
  if (answer.noInfo) {
    await bot.sendMessage(chatId, answer.noInfo.text, answer.noInfo.option);
  }
};

const start = async () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    {
      command: "/map",
      description: "Список авторизивоанных сервисных центров",
    },
  ]);

  bot.on("message", async (msg) => {
    const cliId = msg.from.id;
    let text = msg.text;
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const time = msg.date;
    const doc = msg.document;
    const group = msg.chat.type === "supergroup" ? true : false;

    if (!text && !doc) {
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
      if (!group) {
        await MessageLog.create({ cliId, text, chatId, username });
      }
      switch (true) {
        case text === "/start":
          const stream = fs.createReadStream(
            path.join(process.cwd(), "/public/images/INTERSOL_logo.jpg")
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
            if (doc) {
              await bot.sendMessage(chatId, answer.text, answer.option);
            } else {
              await sendMsg(answer, chatId, text);
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
    let answer;
    switch (text) {
      case "Excel_template":
        await bot.sendDocument(
          chatId,
          path.join(process.cwd(), "/public/Price_list_warehouse.xlsx")
        );
        break;
      case "email_BD":
        await bot.sendMessage(chatId, "Выберите БД", botoptions.adminBDtopost);
        break;
      case "email_log_BD":
        break;
      case "Excel_analog_template":
        await bot.sendDocument(
          chatId,
          path.join(process.cwd(), "/public/analog_template.xlsx")
        );
        break;
      case "Excel_tool-sp_template":
        await bot.sendDocument(
          chatId,
          path.join(process.cwd(), "/public/Tool_sp_template.xlsx")
        );
        break;
      case "commitToolChanges-true":
        answer = await createAnswerForCallback(text, cliId);
        await bot.sendMessage(chatId, answer.text, answer.option);
        break;
      case "commitToolChanges-false":
        answer = await createAnswerForCallback(text, cliId);

      default:
        try {
          const cbtext = text.split("%");
          if (cbtext.length > 1) {
            answer = await createAnswerForCallback(cbtext[2]);
            await sendMsg(
              answer,
              chatId,
              cbtext[2],
              Number(cbtext[3]),
              Number(cbtext[0]),
              cbtext[1]
            );
          } else {
            answer = await createAnswerForCallback(cbtext[0]);
            await sendMsg(answer, chatId, cbtext[0]);
          }
        } catch (error) {
          await bot.sendMessage(
            chatId,
            "problem with callback_query",
            botoptions.defaultoption
          );
          return;
        }
    }
  });
};

start();
