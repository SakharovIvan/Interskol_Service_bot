import { sp_service } from "../services/sparepart.service.js";
import { Tg_view } from "../views/telegram.js";

export class Answer {
  constructor(data) {
    this.msg = data.msg;
    this.cb = data.cb;
    this.chatId = data.chatId;
    this.msgId=data.msgId
    this.username = data.username;
    this.limit = 7;
    this.offset = 0;
    if (this.cb) {
      this.cb_Parse();
    }
  }
  cb_Parse() {
    this.msg.split("%");
  }
  async init() {
    if (this.cb) {
      await this.#cb_search();
    } else {
      await this.#msg_search();
      this.#sp_view()
    }
  }
  async #msg_search() {
    const sp_data = await sp_service.spSearch(this.msg, this.limit);
    this.sp_data = sp_data;
  }
  async #cb_search() {}

  #sp_view() {
    if (!this.sp_data.length) {
      this.sp_view= Tg_view.sp_msg(this.sp_data);
    }else{
    this.sp_view= Tg_view.sp_msg_list(this.sp_data)}
    if(this.sp_data.analog){
        console.log()
        this.analog_view = Tg_view.analog({analog:this.sp_data.analog,msgId:this.msgId,page:this.offset})
    }
  }
  tool_view() {}
}
