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
      fs.readFile(file, (err, data) => {
        if (err) console.log(err);
        const toolcode = toolcode_from_filename(file);
        return {
          data: { tool_code: Number(toolcode), tool_path: file },
          exceldata: data,
        };
      });
  }
};

export default fileparser;
