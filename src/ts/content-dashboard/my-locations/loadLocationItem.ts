import * as Config from "../../config";
import * as Util from "../../util";
import * as Types from "../../types";

export async function loadLocationItem() {
    let id = Util.findGetParameter('id');
    if(id == null) {
        window.location.href = "/pages/content-manager/home.html";
        return;
    }

    document.getElementById('newDeviceBtn').addEventListener("click", _e => window.location.href = "/pages/content-manager/add-device.html?parent=" + id);

    let locationDetailsReq = $.ajax({
        url: Config.GET_LOCATION_DETAILS_ENDPOINT + "/" + id,
        method: 'GET',
        headers: {
            'X-Session-ID': Util.getCookie('sessionid')
        }
    });

    locationDetailsReq.then(e => {
        let r = <Types.IGetLocationDetailsResponse> JSON.parse(e);
        const NAME_FIELD = document.getElementById('name');
        NAME_FIELD.innerHTML = r.name;
    });

    let locationDevicesRequest = $.ajax({
        url: Config.GET_DEVICES_FOR_LOCATION_ENDPOINT + "/" + id,
        method: 'GET',
        headers: {
            'X-Session-ID': Util.getCookie('sessionid')
        }
    });

    locationDevicesRequest.then(e => {
        let r = <Types.IDeviceResponse> JSON.parse(e);
        
        const DEVICE_LIST = document.getElementById('currentDeviceList');
        r.devices.forEach(device => {
            let listItem = document.createElement('li');
            listItem.id = device.id;

            let nameElement = document.createElement('p');
            nameElement.innerHTML = device.name;
            listItem.appendChild(nameElement);

            listItem.addEventListener("click", _e => {
                window.location.href = "/pages/content-manager/view-device.html?id=" + device.id;
            });

            DEVICE_LIST.appendChild(listItem);
        });
    });

    document.getElementById('returnBtn').addEventListener("click", _e => window.location.href = "/pages/content-manager/home.html");
}