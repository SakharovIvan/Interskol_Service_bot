import { ToolPaths, ToolSPmatNo, SPmatNo } from "./models.js";
import XLSX from "xlsx";
import reader from "xlsx";
import path from "path";
const __filename = process.cwd();

const xlsxpars = async (file) => {
  const filexlsx = reader.readFile(path.join(__filename, file));
  let data = [];
  const sheets = filexlsx.SheetNames;
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(
      filexlsx.Sheets[filexlsx.SheetNames[i]]
    );
    temp.forEach((res) => {
      const spmatNo = res["Артикул"];
      const spmatNoanalog = res["Аналог"];
      const sppiccode = res["№ на схеме"];
      const spqty = res["Кол-во шт./изд."];
      const name = res["Наименование детали"];
      const char = res["Характеристика"];
      const warehouseqty = res["Склад количество"];
      const warehousestatus = res["Комментарий по складу Запчасти"];
      const price = res["Оптовые ДСО с НДС"];
      const tool_path = res["Путь"];
      const tool_name = res["Код инструмента"];
      data.push({
        tool_name,
        tool_path,
        spmatNo,
        sppiccode,
        spqty,
        name,
        char,
        spmatNoanalog,
        warehousestatus,
        warehouseqty,
        price,
      });
    });
  }
  return data;
};

const updateToolPaths_All = async (data) => {
  await ToolPaths.bulkCreate(data);
};

const updateToolSPmatNo_All = async (data) => {
  await ToolSPmatNo.bulkCreate(data);
};

const updateSPmatNo_All = async (data) => {
  await SPmatNo.bulkCreate(data);
};
