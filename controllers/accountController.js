// After successful registration logic:
req.flash(
    "notice",
    `Congratulations, you're registered ${account_firstname}. Please log in.`
)
res.status(201).render("account/login", {
    title: "Login",
    nav,
})