import fs from "fs";
import axios from "axios";
import { stream } from "stream/promises";

export default downloadfile = async (link) => {
  const { data } = await axios.get(link, { responseType: "stream" });
  const writeStream = fs.createWriteStream(path.join(__dirname,'1.pdf'))
  await stream.pipline(data, writeStream).catch(console.error)
};
