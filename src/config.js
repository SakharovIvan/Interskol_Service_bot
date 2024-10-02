import { Sequelize } from 'sequelize';
import { PostgresDialect } from '@sequelize/postgres';

const token = '6678230536:AAGVmjy45__gdXflUrlNsXbgdxlxU9gJc5g'

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'fortest',
    user: 'root',
    password: 'root',
    host: '127.0.0.1',
    port: 5432,
  //ssl: true,
  //clientMinMessages: 'notice',
  });

//const sequelizeToolSPmatNo = new Sequelize({
//    dialect: PostgresDialect,
//    database: 'ToolSPmatNo',
//    user: 'root',
//    password: 'root',
//    host: '192.168.0.74',
//    port: 5432,
//    ssl: true,
//    clientMinMessages: 'notice',
//  });
//
//const sequelizeSPmatNo = new Sequelize({
//    dialect: PostgresDialect,
//    database: 'SPmatNo',
//    user: 'root',
//    password: 'root',
//    host: '192.168.0.74',
//    port: 5432,
//    ssl: true,
//    clientMinMessages: 'notice',
//  });
export {sequelize,token}
//module.exports = {pool, client, token}