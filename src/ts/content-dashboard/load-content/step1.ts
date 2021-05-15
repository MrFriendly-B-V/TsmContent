import * as Util from "../../util";
import * as Config from "../../config";
import * as Types from "../../types";

export function step1() {
    if(window.sessionStorage.getItem('userDetailsCompleted') == null) {
        window.location.href = "/pages/content-manager/add-content.html?step=0";
    }

    //A user must be subscirbed to continue, so let's check that.
    let loadUserSubscription = $.ajax({
        url: Config.GET_SUBSCRIBTION_ENDPOINT,
        method: 'POST',
        data: {
            session_id: Util.getCookie("sessionid")
        }
    });

    loadUserSubscription.done(function(e) {
        let subscriptionResponse = <Types.ISubscriptionResponse> e;

        //The user isn't subscribed, redirect them to the place where they can do so
        if(subscriptionResponse.subscription_type != Types.SubscriptionType.Active) {
            //TODO redirect to subscribe page
            alert("SubscriptionType != ACTIVE")
            return;
        }

        //A subscription is built from SubscriptionFeatures, each adding some functionality
        for(let i = 0; i < subscriptionResponse.subscription_features.length; i++) {
            let feature = subscriptionResponse.subscription_features[i];

            switch(feature) {

                //The DeviceBasic flag indicates that the user can select only entire locations (entire buildings)
                case Types.SubscriptionFeature.DeviceBasic:
                    
                    //Create a div which'll hold all the user's locations
                    let ownedLocationsDiv = document.createElement("div");
                    ownedLocationsDiv.id = "ownedLocationsDiv";
                    ownedLocationsDiv.classList.value = "blockSelection";

                    document.getElementById("step1").appendChild(ownedLocationsDiv);

                    //
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
        continueToStep2Button.classList.value = "continue-btn";
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
}