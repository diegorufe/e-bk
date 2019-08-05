
/**
 * Function to connect database and create models 
 */
function connectDb() {
    const Sequelize = require('sequelize');

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './e-bk.sqlite'
    });

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    let data = { "Item": itemsModel(Sequelize, sequelize), "Folder": folderModel(Sequelize, sequelize) }

    return data;
}

/**
 * Create item model
 * @param Sequelize
 * @param sequelize
 */
function itemsModel(Sequelize, sequelize) {
    const Item = sequelize.define('items', {
        // attributes
        code: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        path: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
            // options
            timestamps: false,
            underscored: true
        });

    Item.sync();

    return Item;
}

/**
 * Create Folder model
 * @param Sequelize
 * @param sequelize
 */
function folderModel(Sequelize, sequelize) {
    const Folder = sequelize.define('folders', {
        // attributes
        path: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
            // options
            timestamps: false,
            underscored: true
        });

    Folder.sync();

    return Folder;
}

module.exports = {
    "DB": {
        "connectDb": connectDb
    }
}