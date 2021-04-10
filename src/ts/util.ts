import * as Config from "./config";
import * as Types from "./types";

/**
 * Set a cookie
 * @param name The name of the cookie
 * @param value The value of the cookie
 * @param ttl The TTL of the cookie in seconds
 */
export function setCookie(name: string, value: string, ttl: number): void {
    let date = new Date();
    date.setTime(date.getTime() + (ttl * 1000));
    let expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function setCookieEpoch(name: string, value: string, expires: number): void {
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Get the value of a cookie
 * @param name the name of the cookie
 * @returns Retuns the value of the cookie, or '' if the cookie was not found
 */
export function getCookie(name: string): string {
    let re = new RegExp('[; ]'+name+'=([^\\s;]*)');
    let sMatch = (' '+document.cookie).match(re);
    if (name && sMatch) return unescape(sMatch[1]);
    return '';
}

/**
 * Get the value of a GET parameter
 * @param parameterName The name of the parameter
 * @returns The value of the requested parameter. Null if parameter doesn't exist
 */
 export function findGetParameter(parameterName: string): string {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

export function isLoggedIn(callback: (isLoggedIn: boolean, response: Types.ISessionCheckResponse) => any, from_redirect: string = ""): void {
    let session_id = getCookie("sessionid");
    if(session_id == null || session_id == "") {
        if(from_redirect != "") {
            window.location.href = "/pages/login/login.html?from=" + from_redirect;
        }
        
        callback(false, null);
        return;
    }

    let checkSessionReq = $.ajax({
        url: Config.SESSION_ENDPOINT,
        method: 'POST',
        data: {
            session_id: session_id
        }
    });

    checkSessionReq.done(function(e) {
        let SessionCheckResponse = <Types.ISessionCheckResponse> e;
        
        if(SessionCheckResponse.status != 200) {
            if(from_redirect != "") {
                window.location.href = "/pages/login/login.html?from=" + from_redirect;
            }

            callback(false, null);
            return;
        }

        callback(true, SessionCheckResponse);
        return;
    });

    checkSessionReq.fail(function(e) {
        callback(false, null);
        return;
    });
}