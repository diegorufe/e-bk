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
const remote = require('electron').remote;

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
async function initFolderDestination() {

    //console.log(remote.getGlobal('app'));

    let headerContainer = getElementById(E_BK_ID_HEADER);

    let folder = await remote.getGlobal('findFolder')();
    let items = await remote.getGlobal('findAllItems')();

    if (folder == null || folder == undefined || !existFileOrFolder(folder.path)) {
        folder = '';
    } else {
        folder = folder.path;
    }

    if (headerContainer != null && headerContainer != undefined) {
        // Input text folder destination 
        let inputHeaderFolder = createElement("INPUT");
        inputHeaderFolder.type = "text";
        inputHeaderFolder.classList.add('e-bk-input-text-folder');
        inputHeaderFolder.id = E_BK_ID_HEADER_FOLDER;
        inputHeaderFolder.value = folder;
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

    // If have items add to form
    if (items != null && items != undefined && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            addItem(items[i].dataValues.code, items[i].dataValues.path);
        }
    }
}

/**
 * Method to generate backup
 */
async function backup() {
    let folder = document.getElementById(E_BK_ID_HEADER_FOLDER).value;
    const path = require('path');
    const zip = require('zip-a-folder').zip;
    let folderBack = null;

    if (folder != null && folder != undefined && folder.trim() != "") {
        folderBack = path.join(folder, new Date().toISOString().replace(".", "M").replace("-", "").replace("-", "").replace(":", "").replace(":", ""));
        await remote.getGlobal('deleteAllFolders')();
        await remote.getGlobal('createFolder')(folder);
        mkdir(folderBack);
    } else {
        addMessage(I18N.i18n_folder_empty, 0);
        return 0;
    }

    try {
        // Delete all lines
        await remote.getGlobal('deleteAllItems')();
        // Get all inputs line 
        let inputLines = document.getElementsByClassName('e-bk-line-input');

        if (inputLines != null && inputLines != undefined && inputLines.length > 0) {
            let inputValue = null;
            let inputId = null;
            for (let i = 0; i < inputLines.length; i++) {
                inputId = parseInt(inputLines[i].id.replace("LineInput", ""));
                inputValue = inputLines[i].value;

                if (inputValue != null && inputValue != undefined && inputValue.trim() != "") {
                    copyRecursiveSync(inputValue, path.join(folderBack, path.basename(inputValue)));
                    // Create item
                    await remote.getGlobal('createItem')(inputId, inputValue.trim());
                }
            }
        }

        // Zip files 
        await zip(folderBack, folderBack + ".zip");

        // Remove files
        rmdir(folderBack);

        addMessage(I18N.i18n_backup_success, 2);

    } catch (ex) {
        console.log(ex);
        // if have errors remove folder backup
        rmdir(folderBack);
    }
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
                addMessage(I18N.i18n_folder_not_exist, 0);
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
        if (keys == null || keys == undefined || keys.length == 0) {
            idItem = 0;
        } else {
            idItem = parseInt(keys[keys.length - 1]) + 1;
        }
    } else {
        if (idItem instanceof String) {
            idItem = parseInt(idItem);
        }
    }

    if (valueItem == null || valueItem == undefined) {
        valueItem = "";
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

    inputLine.value = valueItem;

    inputLine.onchange = function (event) {
        onChangeFileFolder(event, idItem);
    };

    lineDiv.appendChild(inputLine);

    // Select folder 
    let inputItemFolder = createElement("INPUT");
    inputItemFolder.type = "file";
    inputItemFolder.id = inputLine.id + "Folder";
    inputItemFolder.classList.add('e-bk-input-folder');
    inputItemFolder.setAttribute('webkitdirectory', '');
    inputItemFolder.setAttribute('mozdirectory', '');
    inputItemFolder.setAttribute('msdirectory', '');
    inputItemFolder.setAttribute('odirectory', '');
    inputItemFolder.setAttribute('directory', '');

    // On change folder set path for input text folder 
    inputItemFolder.onchange = function (event) {
        let files = event.target.files;
        if (files != null && files != undefined && files.length > 0) {
            let file = files[0];
            if (file != null && file != undefined) {
                getElementById(inputLine.id).value = file.path;
                var eventInput = new Event('change', { bubbles: true });
                getElementById(inputLine.id).dispatchEvent(eventInput);
            }
        }
    };

    lineDiv.appendChild(inputItemFolder);

    let labelInputFolder = createElement("LABEL");
    labelInputFolder.setAttribute('for', inputLine.id + "Folder");
    labelInputFolder.classList.add('e-bk-input-folder-label');
    labelInputFolder.innerText = I18N.i18n_select_folder;
    lineDiv.appendChild(labelInputFolder);

    // Select file 
    // Select folder 
    let inputItemFile = createElement("INPUT");
    inputItemFile.type = "file";
    inputItemFile.id = inputLine.id + "File";
    inputItemFile.classList.add('e-bk-input-folder');

    // On change folder set path for input text folder 
    inputItemFile.onchange = function (event) {
        let files = event.target.files;
        if (files != null && files != undefined && files.length > 0) {
            let file = files[0];
            if (file != null && file != undefined) {
                getElementById(inputLine.id).value = file.path;
                var eventInput = new Event('change', { bubbles: true });
                getElementById(inputLine.id).dispatchEvent(eventInput);
            }
        }
    };

    lineDiv.appendChild(inputItemFile);

    let labelInputFile = createElement("LABEL");
    labelInputFile.setAttribute('for', inputLine.id + "File");
    labelInputFile.classList.add('e-bk-input-folder-label');
    labelInputFile.innerText = I18N.i18n_select_file;
    lineDiv.appendChild(labelInputFile);

    // Button delete 

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

/**
 * Method to add message
 * @param {*} text 
 * @param {*} level 
 */
function addMessage(text, level) {
    let messageDiv = document.createElement("DIV");
    let levelClass = "info";

    if (level != null && level != undefined) {
        if (level == 0) {
            levelClass = "danger";
        } else if (level == 1) {
            levelClass = "warnig";
        } else if (level == 2) {
            levelClass = "info";
        }
    }

    messageDiv.classList.add("e-bk-alert-item");
    messageDiv.classList.add("e-bk-alert-item-" + levelClass);

    messageDiv.onclick = function () {
        document.getElementById("e-bk-alert").removeChild(messageDiv);
    };

    messageDiv.innerHTML = text;

    document.getElementById("e-bk-alert").appendChild(messageDiv);

    setTimeout(function (

    ) {
        document.getElementById("e-bk-alert").removeChild(messageDiv);
    }
        , 15000
    );
}