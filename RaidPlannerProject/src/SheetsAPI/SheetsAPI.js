var KJUR = require('jsrsasign');

var API_KEY = "AIzaSyCnY5OGiMsodEdrrSZ2T2uf0pAjgNdE8CU";
var SHEET_ID = "1tUUuDygJr76WMeQkNq_FUj7YtBWQaONsSPRPPd09CUw";
var BASE_API_URL = "https://sheets.googleapis.com";
var SERVICE_ACCOUNT = "ffxiv-raid-completionist@ffxivraidcompletionist.iam.gserviceaccount.com";
var PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtO40/9wvQWc7q\nuNgDmvL/aTuFH9pTAl6yw4YrjVsigq7XI8QEOpf4Yym8o+pIm0xpXDAAKVKz91QF\n75fvV30dOVykuALsNrma5w7MFmxOxI21rFSz9WI1OgNXl9hfOJ8A3FPm64woaJIn\nyZR0jt3ItRVPK15GM1pjysU+hPFReV2A+qq6IdD76h0zM+eo/moXPqmbopMZSvqk\nlZeHXndViby/JeCIP77r0f2ijQO0hmMjBUC/cBINacZeLQH9ReVxpJkIMtx5zc5J\nhDtpD2LSYGwzuaRp4juKN8psoFKO2IW8szMp//lPT+0tVjuXoZ9DZbs6EzV5qB+3\noGSrqLQ7AgMBAAECggEAHKWD6qd6SyaGypbtlc8KTwVCY/XL/z0dltcxeUNDZlYQ\n/p+5+u8LkXYogTrj88TGooetomEy/XKxcNfZmqkvleUV9mE9jn1QPRbnggVVPMNR\nIdFRIn86Ec45nkMMc1akKJrGvyGFiGsefDjf9VRoxZd4YiKsUNSOJoFyE7AdTdkL\n4G0AX+AkL4T0QrxvX1BS2ZrekoLV/92Bhjr17IEYlsNEQWIy9TPPsHp9wTC+lyjx\nTtO0TEZmx/q2VA3z/9jPzzHg75Xu9TWZhn15eyYstDX45grT73ij24B6tpe8AR5w\nz1TW3J2KOltlf+egRfowD3kxmZkoMnlqnz0gj+Q3pQKBgQDT1VLhdghmocTwo+VU\nj+Od75O0yiH/wm7+JtghMYkZhOOCSknqd0bvwEn8bxmzejCoZdBJDNh+ibOIIBZr\nrXXyi99Gg8WTvPxQgBzkIbR1l8IjhuxM57bzC7PUCeDkdCC57bQRnD8GgK9BCS9a\njGeyAOqRFvdYNCUev6GqJgHTdQKBgQDRWedVT2DViyUk0bb0zaP9BKG0SWh4KGU1\nDzz68sB4i9rGO/esVWLBTBnvFzXzDezip0MXI3m0jV+RYnJ5Z077h/byypAQ54Ne\ncEp2z43bxndgWvuqGz9jp+GC06Ya+Kgi+lzMXPos+lw4XT4VSuZCBbVUzYV7UjSp\nAn0uIEvi7wKBgQCGrCuZ/RFQNm5fUsNcpHHgGcz89jjxQeqQl592UujHmY2Oaq5d\nauFlUQl4fCWJzhgbJ0do+cq1f9PsqgG3CTtgLP6Q9Ptqdo6umxRDEQ6KaCXbsk6O\ngg30rK7yEimw9AdOTUnanEwRVUSWA0Hgvjy6lQyLm18660PiLZCY/LrSdQKBgQDK\nbc48NVcC5VrzMT1hlP5+h138wAaeOSEznxpt5RCq/0B58j5Yiu/EzNs+zwjBjrOB\nrg43b3wdU54XLERYk8ZRfXUR60BGuDXUuWunWqZm3o9Lwm4aW+J9cDWklRbGea3K\ntJ/KlBTsLOHDNpXzbMsdB/wAlgH97s0wp1F3qo72TQKBgHH+sgbP94eZ+V+6zNij\nmrOIu75YAQlt+5k9pb6e8Ryg8GSmlrRjLI1Qy2GR40OBbTQoHRL5lPchY1xHfgdQ\nBrdGR7PvRQ7z5IzDS0VkK4olDf5boz2WGgT64UQJHn44Q/jwO9P9hNhcCI0SUYrG\nNgUaLLaugKYwbEbK0tom0yBb\n-----END PRIVATE KEY-----\n"

var accessToken = "-";

let GetValuesUrl = (sheetId, cells) => BASE_API_URL + `/v4/spreadsheets/${sheetId}/values/${cells}`;
let PutValuesUrl = (sheetId, cells) => BASE_API_URL + `/v4/spreadsheets/${sheetId}/values/${cells}`;
let AppendValuesUrl = (sheetId, cells) => BASE_API_URL + `/v4/spreadsheets/${sheetId}/values/${cells}:append`;

class SheetsAPI {
    init(onReady) {
        var pHeader = { "alg": "RS256", "typ": "JWT" }
        var sHeader = JSON.stringify(pHeader);

        var pClaim = {};
        pClaim.aud = "https://www.googleapis.com/oauth2/v3/token";
        pClaim.scope = "https://www.googleapis.com/auth/spreadsheets";
        pClaim.iss = SERVICE_ACCOUNT;
        pClaim.exp = KJUR.jws.IntDate.get("now + 1hour");
        pClaim.iat = KJUR.jws.IntDate.get("now");

        var sClaim = JSON.stringify(pClaim);

        var sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, PRIVATE_KEY);

        var XHR = new XMLHttpRequest();
        var urlEncodedData = "";
        var urlEncodedDataPairs = [];

        urlEncodedDataPairs.push(encodeURIComponent("grant_type") + '=' + encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer"));
        urlEncodedDataPairs.push(encodeURIComponent("assertion") + '=' + encodeURIComponent(sJWS));
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        // We define what will happen if the data are successfully sent
        XHR.addEventListener('load', function (event) {
            var response = JSON.parse(XHR.responseText);
            accessToken = response["access_token"];
            onReady();
        });

        // We define what will happen in case of error
        XHR.addEventListener('error', function (event) {
            console.log('Oops! Something went wrong.');
            onReady();
        });

        XHR.open('POST', 'https://www.googleapis.com/oauth2/v3/token');
        XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        XHR.send(urlEncodedData);
    }

    setAccessToken(token){
        this.accessToken = token;
    }

    async getValues(sheetId, cells, getByColumn) {
        let cellNotation = this.getCellNotation(sheetId, cells);
        let requestUrl = this.appendHeaders(GetValuesUrl(SHEET_ID, cellNotation), false, false, getByColumn);

        let response = await fetch(requestUrl);
        let myJson = await response.json(); //extract JSON from the http response
        console.log(myJson);
    }

    async setValues(sheetId, cells, value) {
        let cellNotation = this.getCellNotation(sheetId, cells);
        let requestUrl = this.appendHeaders(PutValuesUrl(SHEET_ID, cellNotation), true, false, false);

        let jsonData = {
            "values": [
              [
                value
              ]
            ]
          }
        await fetch(requestUrl, this.buildPostRequest(jsonData));
    }

    async appendValues(sheetId, cells, values){
        let cellNotation = this.getCellNotation(sheetId, cells);
        let requestUrl = this.appendHeaders(AppendValuesUrl(SHEET_ID, cellNotation), true, true, false);
        
        let jsonData = {
            
            "values": [values]
          }
        await fetch(requestUrl, this.buildPostRequest(jsonData));
    }

    buildPostRequest(jsonData){
        return {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        }
    }

    getCellNotation(sheetId, cells){
        if(!cells){
            return sheetId;
        }else{
            cells = cells.replace(':', "\%3A");
            if(!sheetId){
                return cells;
            }else{
                return `${sheetId}!${cells}`;
            }
        }
    }

    appendHeaders(url, appendValueInputOption, appendInsertDataOption, appendMajorDimensionColumn) {
        let appended = `${url}?key=${API_KEY}&access_token=${accessToken}`;

        if(appendValueInputOption){
            appended += "&valueInputOption=RAW";
        }

        if(appendInsertDataOption){
            appended += "&insertDataOption=INSERT_ROWS";
        }

        if(appendMajorDimensionColumn){
            appended += "&majorDimension=COLUMNS";
        }

        return appended;
    }
}

export default SheetsAPI;