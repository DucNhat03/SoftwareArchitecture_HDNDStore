window.addEventListener("scroll", function() {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
      header.classList.add("scrolled");
  } else {
      header.classList.remove("scrolled");
  }
});

// window.onclick = function(event) {
//   if (event.target == thin_black_film) {
//     thin_black_film.style.display = "none";
//     menu.style.display = "none";
//     search.style.display = "none";
//   }
// };


