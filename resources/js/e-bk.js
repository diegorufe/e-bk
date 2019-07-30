/**
 * Constants
 */
const E_BK_ID_HEADER = "e-bk-header";
const E_BK_ID_BODY = "e-bk-body";
const E_BK_ID_HEADER_FOLDER = "e-bk-header-folder";
const E_BK_ID_HEADER_FOLDER_DIRECTORY = "e-bk-header-folder-directory";

/**
 * Method to init application
 */
function init() {
    loadI18n();
    initFolderDestination();
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
        inputHeaderFolder.onchange = onChangeFileFolder;
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
                    //getElementById(E_BK_ID_HEADER_FOLDER).onchange();
                }
            }
        };

        headerContainer.appendChild(inputHeaderFolder);

        let labelInputFolder = createElement("LABEL");
        labelInputFolder.setAttribute('for', E_BK_ID_HEADER_FOLDER_DIRECTORY);
        labelInputFolder.classList.add('e-bk-input-folder-label');
        labelInputFolder.innerText = I18N.i18n_select_folder;
        headerContainer.appendChild(labelInputFolder);

    }
}

/**
 * On chage file or folder 
 * @param {*} event 
 */
function onChangeFileFolder(event) {
    if (event != null) {
        let value = event.target.value;
        if (value != null && value != undefined && value.trim() != '') {
            // If file not exsite, set blank value
            if (!existFileOrFolder(value)) {
                getElementById(event.target.id).value = '';
            }
        }
    }
}