document?.addEventListener("DOMContentLoaded", function () {
  console.log("App initialized");
  const e = document.querySelector(".navMenu"),
    t = document.querySelector(".navLinks");
  e?.addEventListener("click", () => {
    t.classList.toggle("navLinksActive");
  });
  const n = document.querySelector(".title"),
    o = document.querySelector(".items"),
    l = document.querySelector(".arrow");
  n?.addEventListener("click", () => {
    o?.classList.toggle("active"), l?.classList.toggle("arrowDown");
  });
  const r = document.querySelector("#amount"),
    c = document.querySelector("#get");
  r?.addEventListener("input", () => {
    let e = 0.002 * (parseFloat(r.value) || 0);
    c.value = `$${Number(e.toFixed(4)).toLocaleString()}`;
  });
  const d = document.getElementById("transactionType"),
    s = document.getElementById("transactionList"),
    a = document.createElement("h1"),
    i = document.querySelector("#noTxs");
  (a.textContent = "No records found"),
    (a.style.display = "none"),
    s?.appendChild(a),
    d?.addEventListener("change", function () {
      const e = d.value,
        t = s?.querySelectorAll(".txItem") || [];
      let n = 0;
      t?.forEach((t) => {
        const o = t.getAttribute("data-type");
        "" === e || o === e
          ? ((t.style.display = "grid"), n++)
          : (t.style.display = "none");
      }),
        (a.style.display = 0 === n ? "block" : "none"),
        (i.style.display = "none");
    });
  const u = document.getElementById("signupForm"),
    m = document.getElementById("password"),
    y = document.getElementById("confirmPassword"),
    v = document.getElementById("passwordError");
  u?.addEventListener("submit", function (e) {
    m?.value !== y?.value
      ? (e.preventDefault(), (v.style.display = "block"))
      : (v.style.display = "none");
  });
  const p = document.querySelectorAll(".mode-toggle"),
    g = document.querySelectorAll(".logo");
  function S(e) {
    document.documentElement.classList.toggle("dark-mode", e),
      localStorage.setItem("theme", e ? "dark" : "light"),
      (document.body.style.transition = "all 0.5s ease"),
      g.forEach((t) => {
        t.src = e
          ? "/assets/inGallery_logo.png"
          : "/assets/inGallery_logo_black.png";
      }),
      p?.forEach((t) => (t.checked = e));
  }
  S("dark" === localStorage.getItem("theme")),
    p?.forEach((e) => {
      e.addEventListener("change", () => S(e.checked));
    });
  const E = document.querySelector(".previewInput"),
    L = document.querySelector("#imgPreview");
  E?.addEventListener("change", () => {
    const [e] = E.files || [];
    e && (L.innerHTML = `<img src="${URL.createObjectURL(e)}" alt="Preview">`);
  });
  const w = document.querySelector("#usdtAmnt"),
    q = document.querySelector("#receiveAmnt");
  w?.addEventListener("input", () => {
    const e = 0.95 * (parseFloat(w.value) || 0);
    q.value = `$${Number(e.toFixed(2)).toLocaleString()}`;
  });
  const h = document.querySelector("#zoomIn"),
    k = document.querySelector("#zoomOut"),
    B = document.querySelector("#zoomableImage"),
    x = document.querySelector("#zoomInOut"),
    A = document.querySelector("#resetBtn");
  function f(e, t) {
    document.querySelectorAll(e).forEach((e) => {
      e.getBoundingClientRect().top < window.innerHeight - 100
        ? e.classList.add(t)
        : e.classList.remove(t);
    });
  }
  x?.addEventListener("change", () => {
    B.style.width = `${x.value}em`;
  }),
    h?.addEventListener("click", () => {
      (x.value = parseInt(x.value) + 30), (B.style.width = `${x.value}em`);
    }),
    k?.addEventListener("click", () => {
      (x.value = Math.max(15, x.value - 30)), (B.style.width = `${x.value}em`);
    }),
    A?.addEventListener("click", () => {
      (x.value = 15), (B.style.width = "15em");
    }),
    document.querySelector(".popUpBtn")?.addEventListener("click", () => {
      document.querySelector(".popUpBox").classList.add("activeBox");
    }),
    document.querySelector("#closeButton")?.addEventListener("click", () => {
      document.querySelector(".popUpBox").classList.remove("activeBox");
    }),
    document.querySelector(".deleteBtn")?.addEventListener("click", () => {
      document.querySelector(".deletePopup").classList.add("deleteActiveBox");
    }),
    document.querySelector("#deleteCloseBtn")?.addEventListener("click", () => {
      document
        .querySelector(".deletePopup")
        .classList.remove("deleteActiveBox");
    }),
    window.addEventListener("scroll", () => {
      f(".reveal", "active"), f(".revealRight", "active");
    });
  const b = document.querySelector("#walletAddress"),
    I = document.querySelector("#wEditBtn"),
    C = document.querySelector(".formContents");
  b && "" !== b.value
    ? I?.addEventListener("click", () => {
        (b.style.display = "none"), (I.style.display = "none");
        const e = document.createElement("input");
        (e.type = "text"),
          (e.id = "newWalletAddress"),
          (e.name = "walletAddress"),
          (e.placeholder = "enter your BSC Wallet address"),
          (e.value = ""),
          (e.name = "walletAddress"),
          (e.required = "true");
        const t = document.createElement("button");
        (t.type = "submit"),
          (t.textContent = "Done"),
          C.appendChild(e),
          C.appendChild(t);
      })
    : ((I.type = "submit"),
      (I.textContent = "Add"),
      (b.readOnly = !1),
      (b.name = "walletAddress")),
    "undefined" != typeof Swiper &&
      new Swiper(".swiper-co````````ntainer", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: !0,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: { el: ".swiper-pagination", clickable: !0 },
      }),
    console.log("All scripts executed"),
    "serviceWorker" in navigator &&
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((e) => {
            console.log("Service Worker Registered:", e);
          })
          .catch((e) => {
            console.error("Service Worker Registration Failed:", e);
          });
      });
});
