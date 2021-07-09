import * as Config from "../config";
import * as Util from "../util";
import * as $ from "jquery";
import * as Types from "../types";

import { loadUserContent } from "./my-content/loadContent";
import { loadLocations } from "./my-locations/loadLocations";

export async function loadDashboard() {
    //Check if the user is logged in
    await Util.isLoggedIn(() => {}, btoa(window.location.href));

    let req = $.ajax({
        url: Config.GET_SUBSCRIBTION_ENDPOINT,
        method: 'POST',
        data: {
            session_id: Util.getCookie('sessionid')
        }
    });

    req.done(e => {
        let r = <Types.ISubscriptionResponse> e;
        switch(r.status) {
            case 401:
            case 404:
                "/pages/login/login.html?from=" + btoa(window.location.href);
                return;
        }

        if(!r.is_subscribed) {
            alert("You're not subsribed!");
            return;
        }

        for(let f of r.subscription_features) {
            switch(f.toString()) {
                case "CONTENT_BASIC":
                    loadUserContent();
                    break;

                case "DEVICE_BASIC":
                    loadLocations()
                    break;
            }
        }
    });

    req.fail(e => {
        alert("Failed to load user subscriptions!");
    })
}