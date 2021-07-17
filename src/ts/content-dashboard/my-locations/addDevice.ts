import * as Config from "../../config";
import * as Util from "../../util";

interface IAddDeviceForm extends HTMLFormElement {
    deviceName:         HTMLInputElement;
    deviceDescription:  HTMLInputElement;
    serialNumber:       HTMLInputElement;
    productCode:        HTMLInputElement;
}

export async function loadAddDevice() {
    let parentLocation = Util.findGetParameter('parent');
    if(parentLocation == null) {
        window.location.href = "/pages/content-manager/home.html";
        return;
    }

    document.getElementById("saveBtn").addEventListener("click", _e => {
        const INPUT_FORM = <IAddDeviceForm> document.getElementById("addDeviceForm");
        const ERROR_FIELD = document.getElementById("errorMessage");
    
        if(INPUT_FORM.deviceName.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Please enter the name of the device";
            return;
        }
    
        if(INPUT_FORM.serialNumber.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Please enter the serial number of the device";
            return;
        }
    
        if(INPUT_FORM.productCode.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "PLease enter the product code of the device";
            return;
        }

        ERROR_FIELD.classList.add('defaultNoShow');

        console.log(JSON.stringify({
            location_id:    parentLocation,
            name:           INPUT_FORM.deviceName.value,
            description:    INPUT_FORM.deviceDescription.value,
            product_code:   INPUT_FORM.productCode.value,
            serial_number:  INPUT_FORM.serialNumber.value
        }));

        let addDeviceReq = $.ajax({
            url: Config.ADD_DEVICE_ENDPOINT,
            method: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
                location_id:    parentLocation,
                name:           INPUT_FORM.deviceName.value,
                description:    INPUT_FORM.deviceDescription.value,
                product_code:   INPUT_FORM.productCode.value,
                serial_number:  INPUT_FORM.serialNumber.value
            }),
            headers: {
                'X-Session-ID': Util.getCookie('sessionid')
            }
        });


        addDeviceReq.then(_e => {
            window.location.href = "/pages/content-manager/view-location.html?id=" + parentLocation;
        });
    });

    document.getElementById('returnBtn').addEventListener("click", _e => window.location.href = "/pages/content-manager/view-location.html?id=" + parentLocation);
}