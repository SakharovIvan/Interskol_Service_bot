import {
  ToolPaths,
  ToolSPmatNo,
  SPmatNo,
  SPanalog,
  MessageLog,
  CliInfo,
} from "./models.js";

try {
  //await ToolPaths.sync({ alter: true });
  //await ToolSPmatNo.sync({ alter: true });
  //await SPmatNo.sync({ alter: true });
  await SPanalog.sync({ alter: true });
  //await MessageLog.sync();
  //await CliInfo.sync();

  console.log("Соединение с БД было успешно установлено");
} catch (e) {
  console.log("Невозможно выполнить подключение к БД: ", e);
}
