import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

interface IUserDetailsForm extends HTMLFormElement {
    full_name:          HTMLInputElement,
    company:            HTMLInputElement,
    phone_number:       HTMLInputElement,
    address_street:     HTMLInputElement,
    address_postal:     HTMLInputElement,
    address_number:     HTMLInputElement,
}

export function step0() {
    //Get the user's details from the server to pre-fill the form
    let getUserDetailsReq = $.ajax({
        url: Config.GET_USER_DETAILS_ENDPOINT,
        method: 'POST',
        data: {
            session_id: Util.getCookie("sessionid")
        }
    });

    getUserDetailsReq.done(function(e) {
        let userDetails = <Types.IGetUserDetailsResponse> e;
        if(userDetails.status != 200) {

            //If we get a 404, the user doesn't yet exist on the user server, 
            //so let's create a new user
            if(userDetails.status == 404) {
                $.ajax({
                    url: Config.NEW_USER_ENDPOINT,
                    method: 'POST',
                    data: {
                        session_id: Util.getCookie("sessionid")
                    }
                });
            }
        } else {

            //Prefill the form with the information we have
            let userDetailsForm = <IUserDetailsForm> document.getElementById("userDetailsForm");
            userDetailsForm.full_name.value = atob(userDetails.name_base64 ?? "");
            userDetailsForm.company.value = atob(userDetails.company_base64 ?? "");
            userDetailsForm.phone_number.value = userDetails.phone_number.toString() ?? "";
            userDetailsForm.address_street.value = atob(userDetails.addr_street_base64 ?? "");
            userDetailsForm.address_postal.value = atob(userDetails.addr_postal_base64 ?? "");
            userDetailsForm.address_number.value = userDetails.addr_number ?? "";

            (<HTMLSelectElement> document.getElementById("address-country")).value = userDetails.addr_country ?? "NULL"; 
        }
    });

    getUserDetailsReq.fail(function(e) {
        //TODO
        alert("TODO: getUserDetailsReq failed");
    });

    //Fetch the holder for the current step, and make it visible
    let step0holder = document.getElementById("step0");
    step0holder.classList.remove("defaultNoShow");
    step0holder.setAttribute("aria-hidden", "false");

    document.getElementById('step0PreviousBtn').addEventListener("click", (_e) => window.location.href = "/pages/content-manager/home.html");
    document.getElementById("step0ContinueBtn").addEventListener("click", function(e) {
        let form = <IUserDetailsForm> document.getElementById("userDetailsForm");

        //Validate the form
        //No fields may be empty
        let statusField = document.getElementById("step0StatusField");
        if(form.full_name.value == null || form.full_name.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in your full name.";

            return;
        }

        if(form.company.value == null || form.company.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in the name of the company you represent.";

            return;
        }

        if(form.phone_number.value == null || form.phone_number.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in your phone number.";

            return;
        }

        if(form.address_street.value == null || form.address_street.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in your address.";

            return;
        }

        if(form.address_postal.value == null || form.address_postal.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in your Postal Code/ZIP";

            return;
        }

        if(form.address_number.value == null || form.address_number.value == "") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please fill in your house number";

            return;
        }

        let addressCountryField = <HTMLSelectElement> document.getElementById("address-country")
        if(addressCountryField.value == null || addressCountryField.value == "NULL") {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Please select your country.";

            return;
        }

        //Reset the status field, just to be sure it isn't visible if it previously was
        statusField.style.visibility = "none";
        statusField.classList.value = "statusField";
        statusField.innerHTML = "";

        //Send the form to the user server
        let submitFormReq = $.ajax({
            url: Config.UPDATE_USER_DETAILS_ENDPOINT,
            method: 'POST',
            data: {
                session_id: Util.getCookie("sessionid"),
                company_base64: btoa(form.company.value),
                name_base64: btoa(form.full_name.value),
                phone_number: Number.parseInt(form.phone_number.value.replace("+", "00").replace(" ", "")),
                addr_street_base64: btoa(form.address_street.value),
                addr_postal_base64: btoa(form.address_postal.value),
                addr_number: form.address_number.value,
                addr_country: addressCountryField.value
            }
        });

        //We're now done here. We can go to the next step
        submitFormReq.done(function(e) {
            window.sessionStorage.setItem("userDetailsCompleted", "TRUE");
            window.location.href = "/pages/content-manager/add-content.html?step=1";
        });

        submitFormReq.fail(function(e) {
            statusField.style.visibility = 'visible';
            statusField.classList.value = "statusField warningRed";

            statusField.innerHTML = "Something went wrong. Please try again later.";
        });
    });
}