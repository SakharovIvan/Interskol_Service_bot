import { ToolPaths, ToolSPmatNo, SPmatNo, SPanalog } from "./models.js";

const getToolPathInfo = async (toolcode)=>{
    try {
        const data=   await ToolPaths.findOne({where:{tool_code:toolcode}})
        return data.dataValues
    } catch (error) {
        return 'No tools was found'
    }

}

export {getToolPathInfo}