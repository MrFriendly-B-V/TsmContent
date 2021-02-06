/**
 * Set a cookie
 * @param name The name of the cookie
 * @param value The value of the cookie
 * @param ttl The TTL of the cookie in seconds
 */
export function setCookie(name: string, value: string, ttl: number): void {
    var date = new Date();
    date.setTime(date.getTime() + (ttl * 1000));
    var expires = "expires=" + date.toUTCString();

    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Get the value of a cookie
 * @param name the name of the cookie
 * @returns Retuns the value of the cookie, or '' if the cookie was not found
 */
export function getCookie(name: string): string {
    var re = new RegExp('[; ]'+name+'=([^\\s;]*)');
    var sMatch = (' '+document.cookie).match(re);
    if (name && sMatch) return unescape(sMatch[1]);
    return '';
}