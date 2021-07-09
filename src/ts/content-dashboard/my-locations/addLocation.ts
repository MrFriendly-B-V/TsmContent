interface IAddLocationForm extends HTMLFormElement {
    locationName:   HTMLInputElement;
    description:    HTMLInputElement;
    street:         HTMLInputElement;
    postal:         HTMLInputElement;
    number:         HTMLInputElement;
}

export async function loadAddLocation() {
    const ADD_LOCATION_FORM = <IAddLocationForm> document.getElementById('addLocationForm');
    ADD_LOCATION_FORM.addEventListener("submit", e =>  {
        e.preventDefault();
    });

    document.getElementById('returnBtn').addEventListener("click", _e => window.location.href = "/pages/content-manager/home.html");
    document.getElementById('saveBtn').addEventListener("click", _e => {
        const ERROR_FIELD = document.getElementById('errorMessage');
        if(ADD_LOCATION_FORM.locationName.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Name must not be empty";
            return;
        }

        if(ADD_LOCATION_FORM.street.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Street must not be empty";
            return;
        }

        if(ADD_LOCATION_FORM.postal.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Postal Code must not be empty";
            return;
        }

        if(ADD_LOCATION_FORM.number.value == "") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Number must not be empty";
            return;
        }

        let countrySelector = <HTMLSelectElement> document.getElementById('country');
        if(countrySelector.value == "NULL") {
            ERROR_FIELD.classList.remove('defaultNoShow');
            ERROR_FIELD.innerHTML = "Please select a country";
            return;
        }

        ERROR_FIELD.classList.add('defaultNoShow');

        let addLocationReq = $.ajax({
            
        })
    });
}