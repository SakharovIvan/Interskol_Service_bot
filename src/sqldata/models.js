import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config.js";

class ToolPaths extends Model {}
class ToolSPmatNo extends Model {}
class SPmatNo extends Model {}
class SPanalog extends Model {}
class MessageLog extends Model {}
class CliInfo extends Model {}
ToolPaths.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
      unique: true,
    },
    tool_path: {
      type: DataTypes.STRING,
    },
    tool_name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    sequelize,
    createdAt: false,
    updatedAt: "updateTimestamp",
  }
);

ToolSPmatNo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.STRING,
    },
    spmatNo: {
      type: DataTypes.STRING,
    },
    sppiccode: {
      type: DataTypes.STRING,
    },
    spqty: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    createdAt: false,
    updatedAt: "updateTimestamp",
  }
);


MessageLog.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    cliId: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
    chatId: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    createdAt: true,
  }
);

//CliInfo.init(
//  {
//    id: {
//      type: DataTypes.UUID,
//      primaryKey: true,
//      defaultValue: Sequelize.UUIDV4,
//    },
//    cliId: {
//      type: DataTypes.STRING,
//    },
//    email: {
//      type: DataTypes.STRING,
//    },
//    addres: {
//      type: DataTypes.STRING,
//    },
//    cli_name: {
//      type: DataTypes.STRING,
//    },
//  },
//  {
//    sequelize,
//    createdAt: true,
//  }
//);

export { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog, MessageLog };
