const express = require('express');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
/*router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
*/
//Tell the server WHAT to show on the home page:

// This tells Express to look for styles/images in the root "public" folder
router.use(express.static("public"));

// This defines the Home route
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// This route purposely triggers an error (because my cse-340 grader assignment requires it)
router.get("/footer-error", (req, res, next) => {
    const err = new Error("This is a deliberate test error for the grader.")
    err.status = 500
    next(err)
})

module.exports = router;



