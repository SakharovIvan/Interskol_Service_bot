import { SP_ServiceURL } from "../config.js";

class SparepartService {
  init() { }
  async spSearch(spmatNo, limit) {
    const sp_search = await fetch(
      SP_ServiceURL + "?search=" + spmatNo + "&limit=" + limit,
      {
        method: "GET",
      }
    );
    const spinfo = await sp_search.json();
    if (spinfo.length === 1) {
      const analog = await this.analog(spmatNo)
      return { ...spinfo[0], analog, length: 0 }
    }
    return spinfo;
  }

  async analog(spmatNo) {
    const sp_search = await fetch(SP_ServiceURL + "/analog/" + spmatNo, {
      method: "GET",
    });
    const spinfo = await sp_search.json();
    return spinfo;
  }
}
export const sp_service = new SparepartService();
