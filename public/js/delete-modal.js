//this modal will help the user confirm that they want to delete an item

// Get modal elements
const modal = document.querySelector("#confirmModal")
const openBtn = document.querySelector("#openModalBtn")
const closeBtn = document.querySelector("#closeModalBtn")
const confirmBtn = document.querySelector("#confirmDeleteBtn")
const form = document.querySelector("#deleteForm")

// Open modal
openBtn.addEventListener("click", () => {
    modal.style.display = "flex"
})

// Close modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none"
})

// Confirm delete
confirmBtn.addEventListener("click", () => {
    form.submit()
})