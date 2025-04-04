const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-btn');

// Show/hide the clear button based on input value
document.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
        clearButton.style.display = "block";
} else {
        clearButton.style.display = "none";
    }
});
// clear the input field when the clear button is clicked and hide the button
clearButton.addEventListener("click", () => {
    searchInput.value = "";
    clearButton.style.display = "none";
    searchInput.focus();
});