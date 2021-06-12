import * as Util from "../util";

import {step0} from "./load-content/step0";
import {step1} from "./load-content/step1";
import {step2} from "./load-content/step2";
import {step3} from "./load-content/step3";
import {step4} from "./load-content/step4";

export function loadAddContent() {

    //Check if the user is logged in
    Util.isLoggedIn((isLoggedIn) => {
        if(!isLoggedIn) {

        }
    }, btoa(window.location.href));

    //Get the step at which the user is
    //If the step parameter is missing we default to 0
    let step = Number.parseInt(Util.findGetParameter("step") ?? "0");
    
    switch(step) {
        //Personal details
        case 0:
            step0();
            break;

        //Content target location
        case 1:
            step1();
            break;

        //Content target time
        case 2:
            step2();
            break;

        //Content upload
        case 3:
            step3();
            break;
        case 4:
            step4();
            break;
    }
}