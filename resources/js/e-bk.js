/**
 * Constants
 */
const E_BK_ID_HEADER = "e-bk-header";
const E_BK_ID_BODY = "e-bk-body";
const E_BK_ID_HEADER_FOLDER = "e-bk-header-folder";
const E_BK_ID_HEADER_FOLDER_DIRECTORY = "e-bk-header-folder-directory";
const E_BK_ID_BUTTON_ADD = "e-bk-addItem";
const E_BK_ID_BUTTON_DELETEL_ALL = "e-bk-deleteAll";
const E_BK_ID_LINES = "e-bk-lines";

const E_BK_DATA = {
    "folderDestination": null,
    "backupdData": {},
}

/**
 * Method to init application
 */
function init() {
    loadI18n();
    initFolderDestination();
    initButtonsTool();
}

/**
 * Method to init folder destination for copy data 
 */
function initFolderDestination() {
    let headerContainer = getElementById(E_BK_ID_HEADER);

    if (headerContainer != null && headerContainer != undefined) {
        // Input text folder destination 
        let inputHeaderFolder = createElement("INPUT");
        inputHeaderFolder.type = "text";
        inputHeaderFolder.classList.add('e-bk-input-text-folder');
        inputHeaderFolder.id = E_BK_ID_HEADER_FOLDER;
        inputHeaderFolder.onchange = function (event) {
            onChangeFileFolder(event, null);
        };
        headerContainer.appendChild(inputHeaderFolder);

        // Input file for selecction folder 
        inputHeaderFolder = createElement("INPUT");
        inputHeaderFolder.type = "file";
        inputHeaderFolder.id = E_BK_ID_HEADER_FOLDER_DIRECTORY;
        inputHeaderFolder.classList.add('e-bk-input-folder');
        inputHeaderFolder.setAttribute('webkitdirectory', '');
        inputHeaderFolder.setAttribute('mozdirectory', '');
        inputHeaderFolder.setAttribute('msdirectory', '');
        inputHeaderFolder.setAttribute('odirectory', '');
        inputHeaderFolder.setAttribute('directory', '');

        // On change folder set path for input text folder 
        inputHeaderFolder.onchange = function (event) {
            let files = event.target.files;
            if (files != null && files != undefined && files.length > 0) {
                let file = files[0];
                if (file != null && file != undefined) {
                    getElementById(E_BK_ID_HEADER_FOLDER).value = file.path;
                    var eventInput = new Event('change', { bubbles: true });
                    getElementById(E_BK_ID_HEADER_FOLDER).dispatchEvent(eventInput);
                }
            }
        };

        headerContainer.appendChild(inputHeaderFolder);

        let labelInputFolder = createElement("LABEL");
        labelInputFolder.setAttribute('for', E_BK_ID_HEADER_FOLDER_DIRECTORY);
        labelInputFolder.classList.add('e-bk-input-folder-label');
        labelInputFolder.innerText = I18N.i18n_select_folder;
        headerContainer.appendChild(labelInputFolder);

        let buttonBackup = createElement("BUTTON");

        buttonBackup.classList.add("button");

        buttonBackup.classList.add("succes");

        buttonBackup.classList.add("delete-line");

        buttonBackup.type = "button";

        buttonBackup.onclick = function (event) {
            backup();
        };

        buttonBackup.innerText = I18N.i18n_backup;

        headerContainer.appendChild(buttonBackup);

    }
}

/**
 * Method to generate backup
 */
function backup(){

}

/**
 * Function to init buttons tool
 */
function initButtonsTool() {
    getElementById(E_BK_ID_BUTTON_ADD).innerText = I18N.i18n_add_item;
    getElementById(E_BK_ID_BUTTON_DELETEL_ALL).innerText = I18N.i18n_delete_all;
}

/**
 * On chage file or folder 
 * @param {*} event 
 * @param {*} idBk
 */
function onChangeFileFolder(event, idBk) {
    if (event != null) {
        let value = event.target.value;
        if (value != null && value != undefined && value.trim() != '') {
            // If file not exsite, set blank value
            if (!existFileOrFolder(value)) {
                getElementById(event.target.id).value = '';
                value = '';
            }
        }

        if (idBk != null && idBk != undefined) {
            E_BK_DATA.backupdData[idBk] = value;
        } else {
            E_BK_DATA.folderDestination = value;
        }
    }
}

/**
 * Method to add item
 * @param {*} idItem 
 * @param {*} valueItem
 */
function addItem(idItem, valueItem) {
    if (idItem == null || idItem == undefined) {
        let keys = Object.keys(E_BK_DATA.backupdData);
        if (keys == null || keys == undefined) {
            idItem = 0;
        } else {
            idItem = keys[keys.length - 1] + 1;
        }
    }

    E_BK_DATA.backupdData[idItem] = valueItem;

    let linesContainer = document.getElementById(E_BK_ID_LINES);

    let lineDiv = document.createElement("DIV");

    lineDiv.classList.add("e-bk-line");

    lineDiv.id = idItem;

    let inputLine = document.createElement("INPUT");

    inputLine.classList.add("e-bk-line-input");

    inputLine.id = idItem + "LineInput";

    inputLine.type = "text";

    inputLine.onchange = function (event) {
        onChangeFileFolder(event, idItem);
    };

    lineDiv.appendChild(inputLine);

    let buttonLine = document.createElement("BUTTON");

    buttonLine.classList.add("button");

    buttonLine.classList.add("danger");

    buttonLine.classList.add("delete-line");

    buttonLine.type = "button";

    buttonLine.onclick = function (event) {
        deleteItem(idItem);
    };

    buttonLine.innerText = I18N.i18n_delete;

    lineDiv.appendChild(buttonLine);

    linesContainer.appendChild(lineDiv);
}

/**
 * Mehtod to delete item 
 * @param {*} idItem 
 */
function deleteItem(idItem) {
    delete E_BK_DATA.backupdData[idItem];

    let line = document.getElementById(idItem);

    line.parentNode.removeChild(line);
}

/**
 * Method to delete all items
 */
function deleteAllItem() {
    E_BK_DATA.backupdData = {};

    document.getElementById(E_BK_ID_LINES).innerHTML = "";
}