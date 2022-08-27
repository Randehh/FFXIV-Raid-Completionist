export function SetCookie(cookieName, cookieValue) {
    const d = new Date();
    d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
    document.cookie = `${cookieName}=${cookieValue}; expires=${d.toUTCString()};`;
}

export function GetCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}