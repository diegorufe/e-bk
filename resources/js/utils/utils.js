/**
 * Method to add map to other map
 * @param {*} mapToAdd 
 * @param {*} mapExist 
 */
function addToMap(mapToAdd, mapExist) {
    if (mapToAdd != null && mapToAdd != undefined) {
        Object.keys(mapToAdd).forEach(function (key) {
            mapExist[key] = mapToAdd[key];
        });
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

/**
 * Method to check the file or folder exist
 * @param {*} path for the file or folder
 */
function existFileOrFolder(path) {
    let exists = false;
    if (path != null && path != undefined) {
        try {
            const fs = require('fs')
            if (fs.existsSync(path)) {
                exists = true;
            }
        } catch (err) {
            console.error(err)
        }
    }
    return exists;
}