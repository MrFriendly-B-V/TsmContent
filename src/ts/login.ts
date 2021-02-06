import * as $ from "jquery";
import * as Config from "./config";
import * as Common from "./common";
import { LoginResponse } from "./responses";

export function setupLogin() {

    document.getElementById("submit").addEventListener("click", function(e) {
        doLogin();
    });

    document.getElementById("login").addEventListener("submit", function(e) {
        e.preventDefault();
    });
}

interface LoginForm extends HTMLFormElement {
    email:      HTMLInputElement;
    password:   HTMLInputElement;
}

//Log the user in
function doLogin() {
    var loginForm = <LoginForm> document.getElementById("login");

    //Get the email and password
    var email = loginForm.email.value;
    var password = loginForm.password.value;

    var alertbox = document.getElementById("alertbox");
    
    //Validate the email
    if(!checkEmail(email)) {
        alertbox.innerHTML = "Invalid E-Mail address!";
        alertbox.classList.remove("green");
        alertbox.classList.add("red");
        alertbox.style.visibility = "visible";
        return;
    }

    //Validate that the user entered a password
    if(password == "" || password.length == 0) {
        alertbox.innerHTML = "You need to enter a password!";
        alertbox.classList.remove("green");
        alertbox.classList.add("red");
        alertbox.style.visibility = "visible";
        return;
    }   

    //Make the login request
    var loginRequest = $.ajax({
        url: Config.LOGIN_API + "/login",
        method: 'post',
        data: {
            email: btoa(email),
            password: btoa(password)
        }
    });

    //Request failed
    loginRequest.fail(function(e) {
        alertbox.innerHTML = "Something went wrong, please try again later!";
        alertbox.classList.remove("green");
        alertbox.classList.add("red");
        alertbox.style.visibility = "visible";
    });

    //Request succeeded
    loginRequest.done(function(e) {
        var response = <LoginResponse> e;

        //Account does not exist, inform the user
        if(!response.accountexists) {
            alertbox.innerHTML = "Account does not exist!";
            alertbox.classList.remove("green");
            alertbox.classList.add("red");
            alertbox.style.visibility = "visible";
            return;
        }

        //Login failed (incorrect password probably), inform the user
        if(!response.login) {
            alertbox.innerHTML = "Incorrect combination of E-Mail and password!";
            alertbox.classList.remove("green");
            alertbox.classList.add("red");
            alertbox.style.visibility = "visible";
            return;
        }

        //Set the userid and sessionid cookies
        Common.setCookie("userid", response.userid, 30*24*60*60); //30 days
        Common.setCookie("sessionid", response.sessionid, 30*24*60*60) //30 days

        alertbox.innerHTML = "Logged in!";
        alertbox.classList.add("green");
        alertbox.classList.remove("red");
        alertbox.style.visibility = "visible";

        //Redirect the user to the dashboard
        window.location.href = "dashboard.html"
    });
}

function checkEmail(email: string): boolean {
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm;
    return emailRegex.test(email);
}

function checkPassword(password: string): boolean {
    const passwordRegex = /.{8,}$/gm;
    return passwordRegex.test(password);
}