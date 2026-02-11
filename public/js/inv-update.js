// JavaScript to enable the Update button when a change is made to the form/ otherwise disable the button and show a message to the user that they need to make a change to enable the button
const form = document.querySelector("#updateForm")
const updateBtn = document.querySelector("button")
const message = document.querySelector("#updateMessage")
updateBtn.setAttribute("disabled", true)
    form.addEventListener("change", function () {
        updateBtn.removeAttribute("disabled")
        message.style.display = "none"
    })