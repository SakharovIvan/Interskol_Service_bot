import { ToolPaths, ToolSPmatNo, SPmatNo } from "./models.js";
import reader from "xlsx";
import path from "path";
import XLSX from "xlsx";
const __filename = process.cwd();

const xlsxpars = async (file) => {
  try {
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
        const percentage = res["% Схождести"];
        const sppiccode = res["№ на схеме"];
        const spqty = res["Кол-во шт./изд."];
        const name = res["Наименование детали"];
        const char = res["Характеристика"];
        const warehouseqty = res["Склад количество"];
        const warehousestatus = res["Комментарий по складу Запчасти"];
        const price = res["Оптовые ДСО с НДС"];
        const tool_path = res["Путь"];
        const tool_code = res["Код инструмента"];
        const tool_name = res["Наименование инструмента"];
        data.push({
          tool_name,
          tool_code,
          tool_path,
          spmatNo,
          sppiccode,
          percentage,
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
  } catch (error) {
    return error;
  }
};

const updateBDdata = async (dir, type) => {
  try {
    const xlsxdata = await xlsxpars(dir);
    switch (type) {
      case "ToolSPmatNo":
        await ToolSPmatNo.destroy({ where: {}, truncate: true });
        await ToolSPmatNo.bulkCreate(xlsxdata);
        break;
      case "ToolPath":
        await ToolPaths.destroy({ where: {}, truncate: true });
        await ToolPaths.bulkCreate(xlsxdata);
        break;
      case "SPmatNo":
        const res=await fetch("localhost:3000/spareparts", {
          method: "POST",
          body: JSON.stringify(xlsxdata),
        });
        if(res.status===200){console.log('sucess updated')}else{
        console.log(res)
        }
        break;
      default:
        throw new Error(`Some problem with format ${type}!`);
    }
    return `${type} with data from ${dir} created!`;
  } catch (error) {
    return `${JSON.stringify(error)} ${type} ${dir}`;
  }
};

const createXLSXfromJSON = (jsa, type) => {
  const worksheet = XLSX.utils.json_to_sheet(jsa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "List 1");
  XLSX.writeFile(workbook, "GISdata.xlsx");
  return;
};

export { updateBDdata };
