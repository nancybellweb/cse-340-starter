const baseController = {}

baseController.buildHome = async function(req, res){
  // No need to fetch nav here! It's  in res.locals
    res.render("index", { title: "Home" }) 
}

module.exports = baseController