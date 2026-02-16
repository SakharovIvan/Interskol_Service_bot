import { Sequelize } from "sequelize";
import { PostgresDialect } from "@sequelize/postgres";

const token = "6678230536:AAGVmjy45__gdXflUrlNsXbgdxlxU9gJc5g";



const adminID = [916996491, 289644699, 5192613078];
const emailConfig = {
  host: "smtp.lancloud.ru",
  port: 465,
  secure: true,
  auth: {
    user: "gis@kls-gr.ru",
    pass: "nP8ecQ51",
  },
};

const SchemeServiceURL = "https://interskol-b2b-test.ru/toolservice";
const SP_ServiceURL = "https://interskol-b2b-test.ru/api/spareparts";

export { token, adminID, emailConfig, SchemeServiceURL, SP_ServiceURL };
