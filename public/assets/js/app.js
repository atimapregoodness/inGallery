// app.js (Main File)
document?.addEventListener("DOMContentLoaded", function () {
  console.log("App initialized");

  const navMenu = document.querySelector(".navMenu");
  const navLinks = document.querySelector(".navLinks");

  navMenu?.addEventListener("click", () => {
    navLinks.classList.toggle("navLinksActive");
  });

  const title = document.querySelector(".title");
  const items = document.querySelector(".items");
  const arrow = document.querySelector(".arrow");

  title?.addEventListener("click", () => {
    items?.classList.toggle("active");
    arrow?.classList.toggle("arrowDown");
  });

  // Currency Converter
  const amount = document.querySelector("#amount");
  const get = document.querySelector("#get");
  const IGPRate = 0.002;

  amount?.addEventListener("input", () => {
    const inputValue = parseFloat(amount.value) || 0.0;
    let rate = inputValue * IGPRate;
    get.value = `$${Number(rate.toFixed(4)).toLocaleString()}`;
  });

  // Transaction Filter
  const transactionTypeSelect = document.getElementById("transactionType");
  const transactionList = document.getElementById("transactionList");
  const noRecordsMessage = document.createElement("h1");
  const noTxs = document.querySelector("#noTxs");

  noRecordsMessage.textContent = "No records found";
  noRecordsMessage.style.display = "none";
  transactionList?.appendChild(noRecordsMessage);

  transactionTypeSelect?.addEventListener("change", function () {
    const selectedType = transactionTypeSelect.value;
    const transactions = transactionList?.querySelectorAll(".txItem") || [];
    let visibleCount = 0;

    transactions?.forEach((transaction) => {
      const transactionType = transaction.getAttribute("data-type");
      if (selectedType === "" || transactionType === selectedType) {
        transaction.style.display = "grid";
        visibleCount++;
      } else {
        transaction.style.display = "none";
      }
    });

    noRecordsMessage.style.display = visibleCount === 0 ? "block" : "none";
    noTxs.style.display = "none";
  });

  // Form Validation
  const signupForm = document.getElementById("signupForm");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("passwordError");

  signupForm?.addEventListener("submit", function (e) {
    if (password?.value !== confirmPassword?.value) {
      e.preventDefault();
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }
  });

  // Theme Toggle
  const toggleButtons = document.querySelectorAll(".mode-toggle");
  const logos = document.querySelectorAll(".logo");

  function setTheme(isDark) {
    document.documentElement.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.body.style.transition = "all 0.5s ease";
    logos.forEach((logo) => {
      logo.src = isDark
        ? "/assets/images/inGallery_logo.png"
        : "/assets/images/inGallery_logo_black.png";
    });
    toggleButtons?.forEach((btn) => (btn.checked = isDark));
  }

  const savedTheme = localStorage.getItem("theme") === "dark";
  setTheme(savedTheme);

  toggleButtons?.forEach((btn) => {
    btn.addEventListener("change", () => setTheme(btn.checked));
  });

  // Image Preview
  const imgInp = document.querySelector(".previewInput");
  const imgPreview = document.querySelector("#imgPreview");

  imgInp?.addEventListener("change", () => {
    const [file] = imgInp.files || [];
    if (file) {
      imgPreview.innerHTML = `<img src="${URL.createObjectURL(
        file
      )}" alt="Preview">`;
    }
  });

  //withdraw ========
  const usdtAmnt = document.querySelector("#usdtAmnt");
  const receiveAmnt = document.querySelector("#receiveAmnt");

  usdtAmnt?.addEventListener("input", () => {
    const inputValue = parseFloat(usdtAmnt.value) || 0;
    const txsCost = inputValue * 0.95;
    receiveAmnt.value = `$${Number(txsCost.toFixed(2)).toLocaleString()}`;
  });

  // Image Zooming
  const zoomInButton = document.querySelector("#zoomIn");
  const zoomOutButton = document.querySelector("#zoomOut");
  const zoomableImage = document.querySelector("#zoomableImage");
  const zoomInOut = document.querySelector("#zoomInOut");
  const resetBtn = document.querySelector("#resetBtn");
  const scaleFactor = 30;
  const originalSize = 15;

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

  // Popup Toggle
  document.querySelectorAll(".popUpBtn")?.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".popUpBox").forEach((box) => {
        box.classList.add("activeBox");
      });
    });
  });

  document.querySelectorAll("#closeButton")?.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".popUpBox").forEach((box) => {
        box.classList.remove("activeBox");
      });
    });
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

  const walletInput = document.querySelector("#walletAddress");
  const wEditBtn = document.querySelector("#wEditBtn");
  const formContents = document.querySelector(".formContents");

  if (walletInput && walletInput.value !== "") {
    wEditBtn?.addEventListener("click", () => {
      walletInput.readOnly = true;
      walletInput.name = ""; // Remove the name attribute to exclude it from req.body
      walletInput.style.display = "none";
      wEditBtn.style.display = "none";

      // Create a new input field for wallet address
      const newInput = document.createElement("input");

      newInput.type = "text";
      newInput.id = "newWalletAddress";
      newInput.name = "walletAddress";
      newInput.placeholder = "Enter your BSC Wallet address";
      newInput.value = ``; // Start with an empty value
      newInput.required = true; // Correctly set required attribute (no quotes)

      // Create a new button for submission
      const newBtn = document.createElement("button");
      newBtn.class = "noColor";
      newBtn.type = "submit";
      // newBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      newBtn.textContent = "Done";

      // Append new input and button to the form contents
      formContents.appendChild(newInput);
      formContents.appendChild(newBtn);
    });
  } else {
    // Configure the button when wallet input is empty
    if (wEditBtn) {
      wEditBtn.type = "submit";
      // wEditBtn.textContent = '<i class="fa-solid fa-plus"></i>';
      wEditBtn.textContent = "Add";
      walletInput.readOnly = false; // Allow editing
    }
  }

  // Swiper Initialization
  if (typeof Swiper !== "undefined") {
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
  }

  let deferredPrompt;
  const installBtns = document.querySelectorAll("#installBtn");

  // Register the service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/assets/js/service-worker.js")
      .then((reg) => console.log("Service Worker Registered:", reg))
      .catch((err) => console.error("Service Worker Failed:", err));
  }

  // Listen for the `beforeinstallprompt` event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Prevent the default prompt from showing up
    deferredPrompt = e; // Store the event to use later

    // Show the install buttons
    installBtns.forEach((btn) => {
      btn.hidden = false;
    });
  });

  const nav = document.querySelector("nav");

  // Add scroll shadow effect with transition
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      nav.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      nav.style.transition = "box-shadow 0.3s ease-in-out";
    } else {
      nav.style.boxShadow = "none";
    }
  });

  // Handle install button clicks
  installBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const result = await deferredPrompt.userChoice;
        console.log("User choice:", result.outcome); // Log whether the user accepted or declined

        // After the user choice, clear the deferred prompt and hide the install buttons
        deferredPrompt = null;
        installBtns.forEach((btn) => {
          btn.hidden = true;
        });
      }
    });
  });
  const noticeIcons = document.querySelectorAll("#noticeIcon");
  const noticeBox = document.querySelector(".noticeBox");

  if (noticeIcons.length && noticeBox) {
    noticeIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent body click from firing
        noticeBox.classList.toggle("activeMessages");
      });
    });

    document.addEventListener("click", (e) => {
      const isClickInsideBox = noticeBox.contains(e.target);
      const isClickOnIcon = Array.from(noticeIcons).some((icon) =>
        icon.contains(e.target)
      );

      if (!isClickInsideBox && !isClickOnIcon) {
        noticeBox.classList.remove("activeMessages");
      }
    });
  }

  // Profile Image Preview
  const profileImgInput = document.querySelector("#profileImgInput");
  const profileImg = document.querySelector(".changeProfileImg");
  const imgSubmit = document.querySelector("#imgSubmit");

  if (profileImgInput && profileImg) {
    profileImgInput.addEventListener("change", () => {
      const [file] = profileImgInput.files || [];
      if (file) {
        profileImg.src = URL.createObjectURL(file);
      }
    });
  }

  if (profileImgInput && imgSubmit) {
    function toggleSubmitButton() {
      if (!profileImgInput.files || profileImgInput.files.length === 0) {
        imgSubmit.style.cursor = "not-allowed";
        imgSubmit.setAttribute("disabled", "true");
      } else {
        imgSubmit.style.cursor = "pointer";
        imgSubmit.removeAttribute("disabled");
      }
    }

    // Initial state check
    toggleSubmitButton();

    // Update button state when a file is selected
    profileImgInput.addEventListener("change", toggleSubmitButton);
  }

  // Optional: Show a hint for installation (not really necessary but helpful for users)
  setTimeout(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      console.log("You can install this app via the 'Install App' button.");
    }
  }, 3000);

  console.log("All scripts executed");
});
