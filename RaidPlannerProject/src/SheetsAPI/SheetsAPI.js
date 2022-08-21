var API_KEY = "AIzaSyCnY5OGiMsodEdrrSZ2T2uf0pAjgNdE8CU";
var SHEET_ID = "1tUUuDygJr76WMeQkNq_FUj7YtBWQaONsSPRPPd09CUw";
var BASE_API_URL = "https://sheets.googleapis.com";

let GetValuesUrl = (sheetId, cells) => BASE_API_URL + `/v4/spreadsheets/${sheetId}/values/${cells}`;
let PutValuesUrl = (sheetId, cells) => BASE_API_URL + `/v4/spreadsheets/${sheetId}/values/${cells}`;

class SheetsAPI {
    init() {

    }

    async getValue(sheetId, cells) {
        let cellNotation = `${sheetId}!${cells}`;
        let requestUrl = this.appendHeaders(GetValuesUrl(SHEET_ID, cellNotation));

        let response = await fetch(requestUrl);
        let myJson = await response.json(); //extract JSON from the http response
        console.log(myJson);
    }

    async setValue(sheetId, cell, value) {
        let cellNotation = `${sheetId}!${cell}`;
        let requestUrl = this.appendHeaders(PutValuesUrl(SHEET_ID, cellNotation));

        const rawResponse = await fetch(requestUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values: [value] })
        });
        const content = await rawResponse.json();
    }

    appendHeaders(url) {
        return `${url}?key=${API_KEY}?access_token=${this.accessToken}`;
    }
}

export default SheetsAPI;