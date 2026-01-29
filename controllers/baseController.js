const baseController = {}

baseController.buildHome = async function(req, res) {
  // 1. Create the message
  req.flash("notice", "Flash message is working!")
  // 2. Render the view
  res.render("index", {
    title: "Home",
  })
}

module.exports = baseController