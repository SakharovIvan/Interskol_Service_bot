import path from "path";
import XLSX from "xlsx";
import reader from "xlsx";
import fs, { stat } from "fs";
export const toolcode_from_filename = (text) => {
  const regexp = text.match(/\(.+?\)/g);
  const result = regexp.map((tx) => tx.slice(1, -1));

  return result[0];
};

const __filename = process.cwd();

const fileparser = async (file) => {
  const fileextension = path.extname(file).split(".").slice(1).join();
  switch (true) {
    case fileextension === "pdf":
      const toolcode = toolcode_from_filename(path.basename(file));
      return {
        tool: toolcode,
        data: {
          tool_code: toolcode,
          tool_name: path.basename(file),
          tool_path: file,
        },
        filetype: "toolpdf",
      };
    case fileextension === "xlsx" || fileextension === "xlsm":
      const filexlsx = reader.readFile(path.join(__filename, file));
      let data = [];
      const sheets = filexlsx.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          filexlsx.Sheets[filexlsx.SheetNames[i]]
        );
        temp.forEach((res) => {
          const tool_code = res["Машина"];
          const spmatNo = res["Артикул"];
          const spmatNoanalog = res["Аналог"];
          const sppiccode = res["№ на схеме"];
          const spqty = res["Кол-во шт./изд."];
          const name = res["Наименование детали"];
          const char = res["Характеристика"];
          const warehouseqty = res["Склад количество"];
          const warehousestatus = res["Комментарий по складу Запчасти"];
          const price = res["Оптовые ДСО с НДС"];

          data.push({
            tool_code,
            spmatNo,
            sppiccode,
            spqty: Number(spqty) || null,
            name,
            char,
            spmatNoanalog,
            warehousestatus,
            warehouseqty,
            price,
          });
        });
      }
      let filetype;
      switch (true) {
        case data[0].warehousestatus !== undefined:
          filetype = "warehousestatus";
          break;
        case data[0].spmatNoanalog !== undefined:
          filetype = "analog";
          break;
        default:
          filetype = "toolsp";
      }

      return { exceldata: data, filetype, filepath: file };
  }
};

export default fileparser;
