import * as Config from "../config";
import * as Util from "../util";
import * as $ from "jquery";
import * as Types from "../types";

//TODO temporary code
class SubscriptionResponse implements Types.ISubscriptionResponse {
    status:                 number;
    is_subscribed:          boolean;
    subscription_type:      Types.SubscriptionType;
    subscription_features:  Types.SubscriptionFeature[]
}

export function loadDashboard() {
    Util.isLoggedIn(function(isLoggedIn, response) {
        if(!isLoggedIn) {
            return;
        }

        //Load the user's subscription type
        /*let getSubscriptionReq = $.ajax({
            url: Config.GET_SUBSCRIBTION_ENDPOINT,
            method: 'POST',
            data: {
                session_id: Util.getCookie("session_id"),
            }
        });

        getSubscriptionReq.done(function(e) {

        });
        
        getSubscriptionReq.fail(function(e)) {

        }*/

        //TODO This is the temporary way of getting the subscription
        //TODO as the backend hasn't been build yet
        let subscription = new SubscriptionResponse();
        subscription.status = 200;
        subscription.is_subscribed = true;
        subscription.subscription_type = Types.SubscriptionType.Active;
        subscription.subscription_features = [Types.SubscriptionFeature.ContentBasic, Types.SubscriptionFeature.DeviceBasic];

        for(let i = 0; i < subscription.subscription_features.length; i++) {
            let subscriptionFeature = subscription.subscription_features[i];

            let sectionHolder = document.getElementById("sectionHolder")
            switch(subscriptionFeature) { 
                case Types.SubscriptionFeature.ContentBasic:
                    let headerDiv = document.createElement("div");
                    headerDiv.classList.value = "sectionHeaderHolder";
                
                    let header = document.createElement("h2");
                    header.classList.value = "sectionHeader";
                    header.innerHTML = "Content";

                    let newContentButton = document.createElement("button");
                    newContentButton.classList.value = "newElementButton";
                    newContentButton.innerHTML = "+";

                    newContentButton.addEventListener("click", function(e) {
                        window.location.href = "/pages/content-manager/add-content.html?step=0";
                    });

                    headerDiv.appendChild(header);
                    headerDiv.appendChild(newContentButton);

                    let contentDiv = document.createElement("div");
                    contentDiv.classList.value = "contentDiv section";

                    sectionHolder.appendChild(headerDiv);
                    sectionHolder.appendChild(contentDiv);
                    
                    //Load the user's content
                    let loadUserContentReq = $.ajax({
                        url: Config.GET_USER_CONTENT_ENDPOINT,
                        method: 'POST',
                        data: {
                            session_id: Util.getCookie("sessionid"),
                            user_id: response.user_id
                        }
                    });

                    loadUserContentReq.done(function(e) {
                        
                    });

                    loadUserContentReq.fail(function(e) {

                    });
                default:
                    continue;
            }
        }

    }, btoa("/pages/content-manager/home.html"));
}