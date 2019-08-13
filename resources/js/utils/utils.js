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
            const fs = require('fs');
            if (fs.existsSync(path)) {
                exists = true;
            }
        } catch (err) {
            console.error(err)
        }
    }
    return exists;
}

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
function copyRecursiveSync(src, dest) {
    const fs = require('fs');
    const path = require('path');
    let exists = fs.existsSync(src);
    let stats = exists && fs.statSync(src);
    let isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

/**
 * Method to generate folder
 * @param {*} src 
 */
function mkdir(src) {
    const fs = require('fs');
    fs.mkdirSync(src, { recursive: true });
}

/**
 * Method to remove folder
 * @param {*} src 
 */
function rmdir(src) {
    const fs = require('fs');
    if (fs.existsSync(src)) {
        fs.readdirSync(src).forEach(function (file, index) {
            var curPath = src + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                rmdir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(src);
    }
}