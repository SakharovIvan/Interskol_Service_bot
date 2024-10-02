import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config.js";


class ToolPaths extends Model {}
class ToolSPmatNo extends Model {}
class SPmatNo extends Model {}
class SPanalog extends Model{}

ToolPaths.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    tool_code: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    tool_path: {
      type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
    },
    spmatNo: {
      type: DataTypes.STRING,
    },
    sppiccode: {
      type: DataTypes.INTEGER,
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

SPmatNo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    spmatNo: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    char: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    warehousestatus: {
      type: DataTypes.STRING,
    },
    warehouseqty: {
      type: DataTypes.INTEGER,
    },
    c1name: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, createdAt: false, updatedAt: "updateTimestamp" }
);

SPanalog.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
          },
          spmatNo: {
            type: DataTypes.STRING,
          },
          spmatNoanalog: {
            type: DataTypes.STRING,
          },
    }
)


try {
  await ToolPaths.sync();
  console.log("Соединение с БД было успешно установлено");
} catch (e) {
  console.log("Невозможно выполнить подключение к БД: ", e);
}

export {ToolPaths,ToolSPmatNo,SPmatNo, SPanalog}