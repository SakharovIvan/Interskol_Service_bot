import { SchemeServiceURL } from "../config.js";
import fs from "fs";
import { toolcode_from_filename } from "../parsers/attachmentparser.js";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const __filename = process.cwd();
export default async function sentFile(pathToFile) {
  const readfile = fs.readFileSync(__filename + pathToFile);

  let form = new FormData();
  form.append("pdf", readfile);
  form.append("name", "whatever");

  const toolcode = toolcode_from_filename(path.basename(pathToFile));
  await axios({
    method: "post",
    url: SchemeServiceURL + "/tool/upload/pdf/" + toolcode,
    headers: { "Content-Type": "multipart/form-data" },
    data: {
      files: form,
      name: path.basename(pathToFile),
    },
  })
    .then((res) => console.log("accepted", res.data))
    .catch((err) => console.log(err));
}
