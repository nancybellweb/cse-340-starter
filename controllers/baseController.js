const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    if (nav) {
        res.render("index", { title: "Home", nav })
    } else {
            //handle the case where nav could not be built or defined
            //for example, I can now render an error page or display a fallback value 
            res.render("index", {title: "Home", nav: []}) //empty nav as fallback
    }
}

module.exports = baseController 