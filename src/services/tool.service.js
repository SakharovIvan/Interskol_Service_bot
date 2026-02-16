import { SchemeServiceURL } from "../config"

class ToolService {
    async toolSearch(tool_code) {
        const list = await fetch(SchemeServiceURL + '/tools')
        const filtered_data = list.filter((el) => {

        })
    }
}

export const Tool_service = new ToolService() 