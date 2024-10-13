import { Sequelize } from "sequelize";
import { PostgresDialect } from "@sequelize/postgres";

const token = "6678230536:AAGVmjy45__gdXflUrlNsXbgdxlxU9gJc5g";

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "fortest",
  user: "root",
  password: "root",
  host: "127.0.0.1",
  port: 5432,
  logging: false  ,
  //ssl: true,
  //clientMinMessages: 'notice',
});

const adminID = [916996491];

export { sequelize, token, adminID };
