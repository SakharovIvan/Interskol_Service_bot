export default class SPmatNoDto {
    constructor(data={},tool_code=null){
        this.spmatNo=String(data.spmatNo),
        this.sppiccode=String(data.sppiccode)
        this.spqty=Number(data.spqty)||null
        this.tool_code=tool_code
    }
}