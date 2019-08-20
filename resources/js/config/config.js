
/**
 * Method to load i18n 
 */
function loadI18n() {

    let locale = 'en';

    global.I18N = {};

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myJson = JSON.parse(this.responseText);
            addToMap(myJson, global.I18N);
        }
    };
    xmlhttp.open("GET", "../../resources/i18n/" + locale + ".json", false);
    xmlhttp.send();
}

