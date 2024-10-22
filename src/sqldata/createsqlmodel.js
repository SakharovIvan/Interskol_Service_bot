import {
  ToolPaths,
  ToolSPmatNo,
  SPmatNo,
  SPanalog,
  MessageLog,
  CliInfo,
} from "./models.js";

try {
  await ToolPaths.sync();
  await ToolSPmatNo.sync();
  await SPmatNo.sync();
  await SPanalog.sync();
  await MessageLog.sync();
  await CliInfo.sync();

  console.log("Соединение с БД было успешно установлено");
} catch (e) {
  console.log("Невозможно выполнить подключение к БД: ", e);
}
