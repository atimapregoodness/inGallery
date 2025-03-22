document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  const body = document.body;
  const amount = document.querySelector("#amount");
  const get = document.querySelector("#get");
  const gbpRate = 0.0002;

  if (amount && get) {
    amount.addEventListener("input", () => {
      const inputValue = parseFloat(amount.value) || 0;
      get.value = (inputValue * gbpRate).toFixed(4);
    });
  }

  const signupForm = document.getElementById("signupForm");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      if (password.value !== confirmPassword.value) {
        e.preventDefault();
        passwordError.style.display = "block";
      } else {
        passwordError.style.display = "none";
      }
    });
  }

  // Theme Toggle
  const toggleButtons = document.querySelectorAll(".mode-toggle");
  const logos = document.querySelectorAll(".logo");

  function setTheme(isDark) {
    document.documentElement.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    body.style.transition = "all 0.5s ease";
    logos.forEach((logo) => {
      logo.src = isDark
        ? "/assets/inGallery_logo.png"
        : "/assets/inGallery_logo_black.png";
    });
    toggleButtons.forEach((btn) => (btn.checked = isDark));
  }

  const savedTheme = localStorage.getItem("theme") === "dark";
  setTheme(savedTheme);

  toggleButtons.forEach((btn) => {
    btn.addEventListener("change", () => setTheme(btn.checked));
  });

  // Close Alert Button
  document.querySelector("#closeBtn")?.addEventListener("click", () => {
    document.querySelector("#alert").style.display = "none";
  });

  // Navigation Toggle
  document.querySelector(".navMenu")?.addEventListener("click", () => {
    document.querySelector(".navLinks").classList.toggle("navLinksActive");
  });

  // Image Zooming
  const zoomInButton = document.querySelector("#zoomIn");
  const zoomOutButton = document.querySelector("#zoomOut");
  const zoomableImage = document.querySelector("#zoomableImage");
  const zoomInOut = document.querySelector("#zoomInOut");
  const resetBtn = document.querySelector("#resetBtn");
  const scaleFactor = 30;
  const originalSize = 15;

  if (zoomableImage) {
    zoomInOut?.addEventListener("change", () => {
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    zoomInButton?.addEventListener("click", () => {
      zoomInOut.value = parseInt(zoomInOut.value) + scaleFactor;
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    zoomOutButton?.addEventListener("click", () => {
      zoomInOut.value = Math.max(15, zoomInOut.value - scaleFactor);
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    resetBtn?.addEventListener("click", () => {
      zoomInOut.value = originalSize;
      zoomableImage.style.width = `${originalSize}em`;
    });
  }

  // Popup Toggle
  document.querySelector(".popUpBtn")?.addEventListener("click", () => {
    document.querySelector(".popUpBox").classList.add("activeBox");
  });
  document.querySelector("#closeButton")?.addEventListener("click", () => {
    document.querySelector(".popUpBox").classList.remove("activeBox");
  });

  // Delete Confirmation Popup
  document.querySelector(".deleteBtn")?.addEventListener("click", () => {
    document.querySelector(".deletePopup").classList.add("deleteActiveBox");
  });
  document.querySelector("#deleteCloseBtn")?.addEventListener("click", () => {
    document.querySelector(".deletePopup").classList.remove("deleteActiveBox");
  });

  // Reveal Animations
  function revealElements(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    });
  }

  window.addEventListener("scroll", () => {
    revealElements(".reveal", "active");
    revealElements(".revealRight", "active");
  });

  // Expandable Title
  const hTitle = document.querySelector(".title");
  const hItems = document.querySelector(".items");
  const arrowUp = document.querySelector(".arrow");

  hTitle?.addEventListener("click", () => {
    hItems.classList.toggle("active");
    arrowUp.classList.toggle("arrowDown");
  });

  // Image Preview
  const imgInp = document.querySelector(".previewInput");
  const imgPreview = document.querySelector("#imgPreview");

  imgInp?.addEventListener("change", () => {
    const [file] = imgInp.files;
    if (file) {
      imgPreview.innerHTML = `<img src="${URL.createObjectURL(
        file
      )}" alt="Preview">`;
    }
  });

  // Swiper Initialization
  new Swiper(".swiper-container", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});
