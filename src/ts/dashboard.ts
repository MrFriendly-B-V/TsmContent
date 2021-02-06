import * as $ from "jquery";
import { UserResponse } from "./responses";
import * as Config from "./config";
import * as Common from "./common";

export function setupDashboard() {
    //Check the userid cookie
    var userid = Common.getCookie("userid");
    if(userid == '') {
        //Cookie is not set, redirect the user to login
        window.location.href = "index.html";
        return;
    }

    //Check the sessionid cookie
    var sessionid = Common.getCookie("sessionid");
    if(sessionid == '') {
        //Cookie is not set, redirect the user to login
        window.location.href = "index.html";
        return;
    }

    //Make a request to the login api for the user details
    var getUserDetails = $.ajax({
        url: Config.LOGIN_API + "/user",
        method: 'post',
        data: {
            sessionId: sessionid,
            userId: userid
        }
    })

    //Request failed
    getUserDetails.fail(function(e) {
        //TODO Probably shouldn't redirect the user to login
        window.location.href = "index.html";
        return;
    });

    getUserDetails.done(function(e) {
        var response = <UserResponse> e;

        //Success is false, sessionid and userid probably aren't valid
        if(!response.success) {
            window.location.href = "index.html";
            return;
        }

        //TODO do something with the email, probably display it somewhere
    });

    document.getElementById("logoutbtn").addEventListener("click", function(e) {
        doLogout();
    });
}

function doLogout() {
    //Clear the cookies, by setting their TTL to 1 second
    Common.setCookie("userid", "", 1);
    Common.setCookie("sessionid", "", 1);

    //Redirect the user to the login page
    window.location.href = "index.html";
}