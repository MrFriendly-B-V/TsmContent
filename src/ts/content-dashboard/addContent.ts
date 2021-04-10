import * as Util from "../util";
import * as Config from "../config";
import * as Types from "../types";
import * as $ from "jquery";

export function loadAddContent() {
    let step = Number.parseInt(Util.findGetParameter("step") ?? "0");
    
    switch(step) {
        case 0:
            interface UserDetailsForm extends HTMLFormElement {
                user_name:      HTMLInputElement,
                dateofbirth:    HTMLInputElement,
                company:        HTMLInputElement,
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

                let userDetailsForm = <UserDetailsForm> document.getElementById("userDetailsForm");
                userDetailsForm.user_name.value = userDetails.name;

                let dateofbirth = new Date(userDetails.date_of_birth);
                userDetailsForm.dateofbirth.value = dateofbirth.getFullYear + "-" + dateofbirth.getMonth + "-" + dateofbirth.getDate();

                userDetailsForm.company.value = userDetails.company ?? "";
            });

            getUserDetailsReq.fail(function(e) {

            });

            let step0holder = document.getElementById("step0");
            step0holder.classList.remove("defaultNoShow");
            step0holder.setAttribute("aria-hidden", "false");

            let continueButton = document.getElementById("step0ContinueBtn");
            continueButton.addEventListener("click", function(e) {
                let form = <UserDetailsForm> document.getElementById("userDetailsForm");
                let date_components = form.dateofbirth.value.split("-");
                let date = new Date(Number.parseInt(date_components[0]), Number.parseInt(date_components[1]), Number.parseInt(date_components[2]));

                let statusField = document.getElementById("step0StatusField");
                if(form.user_name.value == null || form.user_name.value == "") {
                    statusField.style.visibility = 'visible';
                    statusField.classList.value = "statusField warningRed";

                    statusField.innerHTML = "Please fill in your full name.";

                    return;
                }

                if(form.dateofbirth.value == null || form.dateofbirth.value == "" || form.dateofbirth.value == "yyyy-mm-dd") {
                    statusField.style.visibility = 'visible';
                    statusField.classList.value = "statusField warningRed";

                    statusField.innerHTML = "Please fill in your date of birth.";

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
                        full_name_base64: btoa(form.user_name.value),
                        date_of_birth: date.valueOf(),
                        company: (form.company.value != "") ? form.company.value : null 
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
                url: Config.GET_SUBSCRIBTION_DETAILS_ENDPOINT,
                method: 'POST',
                data: {
                    session_id: Util.getCookie("sessionid")
                }
            });

            loadUserSubscription.done(function(e) {
                let subscriptionResponse = <Types.ISubscriptionResponse> e;

                for(let i = 0; i < subscriptionResponse.subscription_features.length; i++) {
                    let feature = subscriptionResponse.subscription_features[i];
                    switch(feature) {
                        case Types.SubscriptionFeature.CONTENT_BASIC:
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
                                    alert("TODO");
                                    return;
                                }

                                for(let i = 0; i < userLocationsResponse.locations.length; i++) {
                                    let location = userLocationsResponse.locations[i];

                                    let locationDiv = document.createElement("div");
                                    locationDiv.classList.value = "item";
                                    locationDiv.setAttribute("data-location-id", location.id);
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
                            });

                            userLocationsReq.fail(function(e) {
                                let failStatusElement = document.createElement("h5");
                                failStatusElement.classList.value = "warningRed";
                                failStatusElement.innerHTML = "Something went wrong. Please try again later"

                                ownedLocationsDiv.appendChild(failStatusElement);
                            });

                            break;
                    }
                }
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