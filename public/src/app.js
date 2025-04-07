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
  const gbpRate = 0.002;

  amount?.addEventListener("input", () => {
    const inputValue = parseFloat(amount.value) || 0.0;
    let rate = inputValue * gbpRate;
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
        ? "/assets/inGallery_logo.png"
        : "/assets/inGallery_logo_black.png";
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

  const walletInput = document.querySelector("#walletAddress");
  const wEditBtn = document.querySelector("#wEditBtn");
  const formContents = document.querySelector(".formContents");

  if (walletInput && walletInput.value !== "") {
    wEditBtn?.addEventListener("click", () => {
      walletInput.style.display = "none";
      wEditBtn.style.display = "none";

      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.id = "newWalletAddress";
      newInput.name = "walletAddress";
      newInput.placeholder = "enter your BSC Wallet address";
      newInput.value = "";
      newInput.name = "walletAddress";
      newInput.required = "true";

      const newBtn = document.createElement("button");
      newBtn.type = "submit";
      newBtn.textContent = "Done";
      formContents.appendChild(newInput);
      formContents.appendChild(newBtn);
    });
  } else {
    wEditBtn.type = "submit";
    wEditBtn.textContent = "Add";
    walletInput.readOnly = false;
    walletInput.name = "walletAddress";
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
  const installBtn = document.getElementById("installBtn");

  // Register the service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/js/service-worker.js")
      .then((reg) => console.log("Service Worker Registered:", reg))
      .catch((err) => console.error("Service Worker Failed:", err));
  }

  // Listen for the `beforeinstallprompt` event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // Prevent the default prompt from showing up
    deferredPrompt = e; // Store the event to use later

    // Show the install button
    if (installBtn) {
      installBtn.hidden = false;
    }
  });

  // Handle install button click
  installBtn?.addEventListener("click", async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const result = await deferredPrompt.userChoice;
      console.log("User choice:", result.outcome); // Log whether the user accepted or declined

      // After the user choice, clear the deferred prompt and hide the install button
      deferredPrompt = null;
      installBtn.hidden = true;
    }
  });

  // Optional: Show a hint for installation (not really necessary but helpful for users)
  setTimeout(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      console.log("You can install this app via the 'Install App' button.");
    }
  }, 3000);

  console.log("All scripts executed");
});
