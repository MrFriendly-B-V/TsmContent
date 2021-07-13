import * as Config from "../../config";
import * as Util from "../../util";
import * as Types from "../../types";

export async function loadDeviceItem() {
    let id = Util.findGetParameter('id');
    if(id == null) {
        window.location.href = "/content-manager/pages/home.html";
        return;
    }

    let deviceDetailsReq = $.ajax({
        url: Config.GET_DEVICE_DETAILS_ENDPOINT + "/" + id,
        method: 'GET',
        headers: {
            "X-Session-ID": Util.getCookie('sessionid')
        }
    });

    deviceDetailsReq.then(e => {
        let r = <Types.IDevice> JSON.parse(e);
        const NAME_FIELD = document.getElementById('name');
        const DESCRIPTION_FIELD = document.getElementById('description');

        NAME_FIELD.innerHTML = r.name;
        DESCRIPTION_FIELD.innerHTML = r.description;
    
        const RETURN_BTN = document.getElementById('returnBtn');
        RETURN_BTN.addEventListener("click", _e => {
            window.location.href = "/pages/content-manager/view-location.html?id=" + r.location_id;
        });
    });

    const RESET_BTN = document.getElementById('resetBtn');
    RESET_BTN.addEventListener("click", _e => {
        //TODO
    });
}