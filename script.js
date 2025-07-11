// hamburgur opening closing 



  document.addEventListener("DOMContentLoaded", function () {
    const menu = document.querySelector(".hamburgur-menu");
    const openBtn = document.querySelector(".hamburgur-icon");
    const closeBtn = document.querySelector(".cross-icon");

    // Create overlay dynamically
    const overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    document.body.appendChild(overlay);

    function openMenu() {
      menu.classList.add("active");
      overlay.style.display = "block";
      document.body.classList.add("menu-open");
    }

    function closeMenu() {
      menu.classList.remove("active");
      overlay.style.display = "none";
      document.body.classList.remove("menu-open");
    }

    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMenu();
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });

    overlay.addEventListener("click", () => {
      closeMenu();
    });

    document.addEventListener("click", function (event) {
      const isClickInsideMenu = menu.contains(event.target);
      const isClickOnButton = openBtn.contains(event.target);

      if (!isClickInsideMenu && !isClickOnButton) {
        closeMenu();
      }
    });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });



// mobile sub menu
  document.addEventListener("DOMContentLoaded", function () {
    const submenu = document.querySelector(".submenu");
    const submenuContainer = document.querySelector(".submenu-container");
    const chevronIcon = submenu.querySelector(".fas-submenu");

    // Toggle submenu on click
    submenu.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from bubbling to document
      submenuContainer.classList.toggle("active");
      chevronIcon.classList.toggle("rotate-chevron");
    });

    // Close submenu when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInside = submenu.contains(event.target) || submenuContainer.contains(event.target);

      if (!isClickInside && submenuContainer.classList.contains("active")) {
        submenuContainer.classList.remove("active");
        chevronIcon.classList.remove("rotate-chevron");
      }
    });
  });

// audio of hero button 

function toggleAudio(button) {
  const audio = document.getElementById("mahaveerAudio");
  const icon = button.querySelector("i");
  
  if (audio.paused) {
    audio.play();
    icon.className = "fa-solid fa-circle-pause";
    icon.style.marginRight = "6px";
  } else {
    audio.pause();
    icon.className = "fa-solid fa-headphones"; // Assuming you already styled this
    icon.style.marginRight = ""; // Remove custom margin
  }
  
  // Reset icon when audio ends
  audio.onended = () => {
    icon.className = "fa-solid fa-headphones";
    icon.style.marginRight = "";
  };
}
