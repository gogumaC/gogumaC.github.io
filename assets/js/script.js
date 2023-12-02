document.getElementById("dropdownMenu").addEventListener("click", function () {
  var menu = document.getElementById("mainMenu");
  if (menu.style.display === "block") {
    dropdownMenu.innerText = "(펼쳐보기)";
    menu.style.removeProperty("display");
  } else {
    dropdownMenu.innerText = "(숨기기)";
    menu.style.display = "block";
  }
});
