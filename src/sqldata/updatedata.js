import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";
import path from "path";

const updateToolByCode = async (code, data) => {
ToolPaths.findOne({where:{tool_code:code}})
.then((obj)=>{
  if(obj){return obj.update(data)}
    return ToolPaths.create(data)
})
};

const updateToolSPmatNo = async () => {};


