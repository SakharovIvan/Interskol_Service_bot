import botoptions from "../botoptions.js";
import { SP_warehouse_status_view } from "../lib/sparepart.js";
class TG_View {
  sp_msg_list(data) {

  }
  sp_msg(sp_data) {
    const text = `${sp_data.spmatNo}\n${sp_data.name}\n
⚒️ Характеристика: ${sp_data.char || "Нет информации"}\n
💵 Рекомендованная цена: ${sp_data.price || "Нет информации"} руб\n
🏠 Склад: ${SP_warehouse_status_view[sp_data.warehouseqty] || "Нет информации"}`;
    return {text,option:botoptions.defaultoption,analog};
  }
  analog({analog,msgId,page}){

  }
  
  #paginate(massive, msgId, climsg, bd, page = 0) {
    const len = massive.length;
    if (len <= 5) {
      return massive;
    }
    const strelki = [
      { text: "⬅️", callback_data: `${msgId}%${bd}%${climsg}%${page - 1}` },
      { text: `${page + 1}\/${Math.ceil(len / 5)}`, callback_data: "someshit" },
      { text: "➡️", callback_data: `${msgId}%${bd}%${climsg}%${page + 1}` },
    ];
    const maspage = massive.slice(5 * page, page * 5 + 5);

    maspage.push(strelki);
    return maspage;
  }
  tool_msg(){

  }
}
export const  Tg_view =new TG_View 