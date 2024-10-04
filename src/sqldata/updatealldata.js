import {ToolPaths,ToolSPmatNo,SPmatNo, SPanalog} from './models.js'
import XLSX from "xlsx";
import reader from 'xlsx'
import path from 'path'


const updateToolPaths_All =async(data)=>{
await ToolPaths.bulkCreate(data)
}

const updateToolSPmatNo_All =async(data)=>{

}

const updateSPmatNo_All=async(data)=>{
  
}

const updateSPanalog_All=async(data)=>{
  
}