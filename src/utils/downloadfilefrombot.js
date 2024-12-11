import fs from "fs";
import axios from "axios";
import path from "path";
import { pipeline } from "node:stream/promises";
const __filename = process.cwd();
const __dirname = path.dirname(__filename);

const downloadfile = async (link, name, dir = "/public/temp/") => {
  const { data } = await axios.get(link, { responseType: "stream" });
  const writeStream = fs.createWriteStream(path.join(__filename, dir, name));
  await pipeline(data, writeStream).catch(console.error);
  return dir + name;
};

const movefiletomaindir = async (filePath, newfilePath, deletemode = false) => {
  try {
    const name = path.basename(filePath);
    fs.copyFile(
      path.join(__filename, filePath),
      path.join(__filename, newfilePath, name),
      (err) => {
        if (err) {
          console.log(err);
        }

        console.log("File copied successfully");
      }
    );

    if (deletemode) {
      await deletefilefromTemp(filePath);
    }
  } catch (error) {
    console.log(error);
  }
};

const deletefilefromTemp = async (filePath) => {
  try {
    fs.rm(path.join(__filename, filePath), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("File deleted successfully");
    });
  } catch (error) {
    console.log(error);
  }
};

export { downloadfile, movefiletomaindir, deletefilefromTemp };
