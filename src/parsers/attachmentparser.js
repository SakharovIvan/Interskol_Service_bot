import path from "path";
import XLSX from "xlsx";
import reader from "xlsx";
import fs, { stat } from "fs";
const toolcode_from_filename = (text) => /\(.+?\)/g.exec(text)[0].slice(1, -1);
const __filename = process.cwd();

const fileparser = async (file) => {
  const filetype = path.extname(file).split(".").slice(1).join();
  switch (true) {
    case filetype === "pdf":
      const toolcode = toolcode_from_filename(file);
      return {
        tool: toolcode,
        data: { tool_code: Number(toolcode), tool_path: file },
      };
    case filetype === "xlsx":
      const filexlsx = reader.readFile(path.join(__filename, file));
      let data = [];
      const sheets = filexlsx.SheetNames;
      for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
          filexlsx.Sheets[filexlsx.SheetNames[i]]
        );
        temp.forEach((res) => {
          //  const tool_code = res["Артикул"];
          const spmatNo = res["Артикул"];
          const sppiccode = res["№ на схеме"];
          const spqty = res["Кол-во шт./изд."];
          const name = res["Наименование детали"];
          const char = res["Характеристика"];
          data.push({ spmatNo, sppiccode, spqty, name, char });
        });
      }
      return { exceldata: data };
  }
};

export default fileparser;
