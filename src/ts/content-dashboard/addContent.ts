import * as Util from "../util";
import * as Config from "../config";
import * as Types from "../types";
import * as $ from "jquery";

export function loadAddContent() {
    let step = Number.parseInt(Util.findGetParameter("step") ?? "0");
    
    switch(step) {
        case 0:
            interface IUserDetailsForm extends HTMLFormElement {
                full_name:          HTMLInputElement,
                company:            HTMLInputElement,
                phone_number:       HTMLInputElement,
                address_street:     HTMLInputElement,
                address_postal:     HTMLInputElement,
                address_number:     HTMLInputElement,
            }

            //Get the user details
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
                    if(userDetails.status == 404) {
                        $.ajax({
                            url: Config.NEW_USER_ENDPOINT,
                            method: 'POST',
                            data: {
                                session_id: Util.getCookie("sessionid")
                            }
                        });
                    }
                    return;
                }

                let userDetailsForm = <IUserDetailsForm> document.getElementById("userDetailsForm");
                userDetailsForm.full_name.value = atob(userDetails.name_base64 ?? "");
                userDetailsForm.company.value = atob(userDetails.company_base64 ?? "");
                userDetailsForm.phone_number.value = userDetails.phone_number.toString() ?? "";
                userDetailsForm.address_street.value = atob(userDetails.addr_street_base64 ?? "");
                userDetailsForm.address_postal.value = atob(userDetails.addr_postal_base64 ?? "");
                userDetailsForm.address_number.value = userDetails.addr_number ?? "";

                (<HTMLSelectElement> document.getElementById("address-country")).value = userDetails.addr_country ?? "NULL"; 
            });

            getUserDetailsReq.fail(function(e) {
                //TODO
                alert("TODO: getUserDetailsReq failed");
            });

            let step0holder = document.getElementById("step0");
            step0holder.classList.remove("defaultNoShow");
            step0holder.setAttribute("aria-hidden", "false");

            let continueButton = document.getElementById("step0ContinueBtn");
            continueButton.addEventListener("click", function(e) {
                let form = <IUserDetailsForm> document.getElementById("userDetailsForm");

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

                statusField.style.visibility = "none";
                statusField.classList.value = "statusField";
                statusField.innerHTML = "";

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

                submitFormReq.done(function(e) {
                    window.location.href = "/pages/content-manager/add-content.html?step=1";
                });

                submitFormReq.fail(function(e) {
                    statusField.style.visibility = 'visible';
                    statusField.classList.value = "statusField warningRed";

                    statusField.innerHTML = "Something went wrong. Please try again later.";
                });
            });

            break;
        case 1:
            let loadUserSubscription = $.ajax({
                url: Config.GET_SUBSCRIBTION_ENDPOINT,
                method: 'POST',
                data: {
                    session_id: Util.getCookie("sessionid")
                }
            });

            loadUserSubscription.done(function(e) {
                let subscriptionResponse = <Types.ISubscriptionResponse> e;

                if(subscriptionResponse.subscription_type != Types.SubscriptionType.Active) {
                    //TODO redirect to subscribe page
                    alert("SubscriptionType != ACTIVEd")
                    return;
                }

                for(let i = 0; i < subscriptionResponse.subscription_features.length; i++) {
                    let feature = subscriptionResponse.subscription_features[i];
                    switch(feature) {
                        case Types.SubscriptionFeature.DeviceBasic:
                            let ownedLocationsDiv = document.createElement("div");
                            ownedLocationsDiv.id = "ownedLocationsDiv";
                            ownedLocationsDiv.classList.value = "blockSelection";

                            document.getElementById("step1").appendChild(ownedLocationsDiv);

                            //Load the user's locations
                            let userLocationsReq = $.ajax({
                                url: Config.GET_USER_LOCATIONS_ENDPOINT,
                                method: 'POST',
                                data: {
                                    session_id: Util.getCookie("sessionid")
                                }
                            });

                            userLocationsReq.done(function(e) {
                                let userLocationsResponse = <Types.IGetUserLocationsResponse> e;

                                if(userLocationsReq.status != 200) {
                                    //TODO
                                    alert("TODO: userLocationReq failed: " + userLocationsResponse.status);
                                    return;
                                }

                                for(let i = 0; i < userLocationsResponse.locations.length; i++) {
                                    let location = userLocationsResponse.locations[i];

                                    let locationDiv = document.createElement("div");
                                    locationDiv.classList.value = "item";
                                    locationDiv.id = location.id;
                                    locationDiv.setAttribute("data-selected", "false");

                                    locationDiv.innerHTML = location.name;
                                    locationDiv.addEventListener("click", function(e) {
                                        let isSelected = (locationDiv.getAttribute("data-selected") == "true") ? true : false;

                                        if(isSelected) {
                                            locationDiv.setAttribute("data-selected", "false");
                                            locationDiv.classList.remove("item-selected");
                                        } else {
                                            locationDiv.setAttribute("data-selected", "true");
                                            locationDiv.classList.add("item-selected");
                                        }
                                    });

                                    ownedLocationsDiv.appendChild(locationDiv);
                                }

                                document.getElementById("step1").classList.value = "";
                            });

                            userLocationsReq.fail(function(e) {
                                let failStatusElement = document.createElement("h3");
                                failStatusElement.classList.value = "warningRed";
                                failStatusElement.innerHTML = "Something went wrong. Please try again later."
                
                                let failStatusHolder = document.createElement("div");
                                failStatusHolder.classList.value = "warningHolder";
                
                                failStatusHolder.appendChild(failStatusElement);
                                document.getElementById("contentHolder").appendChild(failStatusHolder);
                                return;
                            });

                            break;
                    }
                }

                let continueToStep2Button = document.createElement("button")
                continueToStep2Button.classList.value = "step1-continue-btn";
                continueToStep2Button.innerHTML = "Continue";

                continueToStep2Button.addEventListener("click", (_e) => {
                    let selectedLocations = document.querySelectorAll("[data-selected=true]");
                    let selectedLocationsIds: string[] = new Array();

                    selectedLocations.forEach((e) => {
                        selectedLocationsIds.push(e.id);
                    });

                    window.sessionStorage.setItem("selectedLocations", selectedLocationsIds.join(","));

                    window.location.href = "/pages/content-manager/add-content.html?step=2";
                });

                document.getElementById("step1").appendChild(continueToStep2Button);
            });

            loadUserSubscription.fail(function(e) {
                let failStatusElement = document.createElement("h3");
                failStatusElement.classList.value = "warningRed";
                failStatusElement.innerHTML = "Something went wrong. Please try again later."

                let failStatusHolder = document.createElement("div");
                failStatusHolder.classList.value = "warningHolder";

                failStatusHolder.appendChild(failStatusElement);
                document.getElementById("contentHolder").appendChild(failStatusHolder);
                return;
            });

            break;
        case 2:

        case 3:

    }
}