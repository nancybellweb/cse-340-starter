/*const invModel = require("../models/inventory-model")
const Util = {} */

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
/*Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

module.exports = Util*/

const invModel = require("../models/inventory-model")

const Util = {
    getNav: async function (req, res, next) {
        try {
            let data = await invModel.getClassifications()
            let list = "<ul>"
            list += '<li><a href="/" title="Home page">Home</a></li>'
            data.rows.forEach((row) => {
                list += "<li>"
                list +=
                '<a href="/inv/type/' +
                row.classification_id +
                '" title="See our inventory of ' +
                row.classification_name +
                ' vehicles">' +
                row.classification_name +
                "</a>"
                list += "</li>"
            })
            list += "</ul>"
            return list
        } catch (error) {
            console.error("Error building navigation list: ", error)
            throw error
        }
        //with this structure, if an error occurs, it will be logged to the console, 
        // and the error will be re-thrown for further handling upstream.
        
    }
}

module.exports = Util

/* ********** This way when importing Util from utilities/index.js, 
in other parts of my code, I will have access to the getNav function. ********** */