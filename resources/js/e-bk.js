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
                }
            }
        };

        headerContainer.appendChild(inputHeaderFolder);

        let labelInputFolder = createElement("LABEL");
        labelInputFolder.setAttribute('for', E_BK_ID_HEADER_FOLDER_DIRECTORY);
        labelInputFolder.classList.add('e-bk-input-folder-label');
        labelInputFolder.innerText = 'Label';
        headerContainer.appendChild(labelInputFolder);

    }
}

/**
 * Method to get element by id 
 * @param {*} id is the id asociated for element in the html view
 */
function getElementById(id) {
    return id != null && id != undefined ? document.getElementById(id) : null;
}

/**
 * Method to create element 
 * @param {*} tagName is the name for the element to create
 */
function createElement(tagName) {
    return document.createElement(tagName);
}