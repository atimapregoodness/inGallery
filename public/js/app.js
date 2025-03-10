document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');

  const body = document.body;

  const toggleButton = document.querySelector('.mode-toggle');
  const toggleButton2 = document.querySelector('.mode-toggle2');
  const logos = document.querySelectorAll('.logo');

  //theme changer ===========================================================
  if (body && logos && toggleButton && toggleButton2) {
    function setTheme(isDark) {
      document.documentElement.classList.toggle('dark-mode', isDark);

      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      body.style.transition = 'all 0.5s ease';
      logos.forEach(logo => logo.src = isDark ? '/assets/inGallery_logo.png' : '/assets/inGallery_logo_black.png');
      toggleButton.checked = isDark;
      toggleButton2.checked = isDark;
    }

    // Check if dark mode is saved in localStorage
    setTheme(localStorage.getItem('theme') === 'dark');

    // Listen for toggle switch changes
    toggleButton.addEventListener('change', () => setTheme(toggleButton.checked));
    toggleButton2.addEventListener('change', () => setTheme(toggleButton2.checked));
  }


  const closeBtn = document.querySelector('#closeBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const alert = document.querySelector('#alert');
      alert.style.display = 'none';
    });
  }

  const navLinks = document.querySelector('.navLinks');
  const navMenu = document.querySelector('.navMenu');

  if (navMenu) {
    navMenu.addEventListener('click', () => {
      navLinks.classList.toggle('navLinksActive');
    });
  }



  // const infoBtn = document.querySelector('#infoBtn');

  // if (infoBtn) {
  //   infoBtn.addEventListener('click', () => {
  //     const infoContainer = document.querySelector('.infoContainer');
  //     infoContainer.classList.toggle('infoActive');
  //   });
  // }


  // const mACBtn = document.querySelector('motionAlertCloseBtn');
  // if (mACBtn) {
  //   mACBtn.addEventListener('click', () => {
  //     const motionAlert = document.querySelector('#motionAlert');
  //     motionAlert.style.display = 'none';
  //   });
  // }


  const zoomInButton = document.querySelector('#zoomIn');
  const zoomOutButton = document.querySelector('#zoomOut');
  const zoomableImage = document.querySelector('#zoomableImage');
  const zoomInOut = document.querySelector('#zoomInOut');
  const resetBtn = document.querySelector('#resetBtn');

  if (zoomInButton && zoomOutButton && zoomableImage && zoomInOut && resetBtn) {
    const scaleFactor = 30;
    const originalSize = 15;
    // let isDragging = false;
    // let startX, startY;
    // let offsetX = 0, offsetY = 0;

    zoomInOut.addEventListener('change', function () {
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    // 🔍 Zoom In button
    zoomInButton.addEventListener('click', function () {
      zoomInOut.value = parseInt(zoomInOut.value) + scaleFactor;
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    // 🔎 Zoom Out button
    zoomOutButton.addEventListener('click', function () {
      zoomInOut.value = Math.max(15, zoomInOut.value - scaleFactor);
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    // 🔄 Reset button
    resetBtn.addEventListener('click', () => {
      zoomInOut.value = originalSize;
      zoomableImage.style.width = `${originalSize}em`;
      offsetX = 0;
      offsetY = 0;
    });

    // // 🖱 Mouse Wheel Zoom
    // document.addEventListener("wheel", (e) => {
    //   e.preventDefault();
    //   if (e.deltaY < 0) {
    //     zoomInOut.value = parseInt(zoomInOut.value) + scaleFactor;
    //   } else {
    //     zoomInOut.value = Math.max(15, zoomInOut.value - scaleFactor);
    //   }
    //   zoomableImage.style.width = `${zoomInOut.value}em`;
    // });

    // // 🖱 Dragging Functionality
    // zoomableImage.addEventListener("mousedown", (e) => {
    //   isDragging = true;
    //   startX = e.clientX - offsetX;
    //   startY = e.clientY - offsetY;
    //   zoomableImage.style.cursor = "grabbing";
    // });

    // document.addEventListener("mousemove", (e) => {
    //   if (!isDragging) return;
    //   offsetX = e.clientX - startX;
    //   offsetY = e.clientY - startY;
    //   zoomableImage.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    // });

    // document.addEventListener("mouseup", () => {
    //   isDragging = false;
    //   zoomableImage.style.cursor = "grab";
    // });
  }




  const popUpBtn = document.querySelector('.popUpBtn');
  const popUpBox = document.querySelector('.popUpBox');
  const closeButton = document.querySelector('#closeButton');

  if (popUpBox && popUpBtn && closeButton) {
    popUpBtn.addEventListener('click', () => {
      popUpBox.classList.add('activeBox');

    });
  }

  if (popUpBox && closeButton) {
    closeButton.addEventListener('click', () => {
      popUpBox.classList.remove('activeBox');
    });
  }


  const deleteBtn = document.querySelector('.deleteBtn');
  const deletePopup = document.querySelector('.deletePopup');
  const deleteCloseBtn = document.querySelector('#deleteCloseBtn');

  if (deletePopup && deleteBtn && deleteCloseBtn) {
    deleteBtn.addEventListener('click', () => {
      deletePopup.classList.add('deleteActiveBox');
    });
  }

  if (deletePopup && deleteCloseBtn) {
    deleteCloseBtn.addEventListener('click', () => {
      deletePopup.classList.remove('deleteActiveBox');
    });
  }


  window.addEventListener('scroll', reveal);
  function reveal() {
    let reveals = document.querySelectorAll('.reveal');

    for (let i = 0; i < reveals.length; i++) {
      let windowheight = window.innerHeight;
      let revealTop = reveals[i].getBoundingClientRect().top;
      let revealPoint = 100;

      if (revealTop < windowheight - revealPoint) {
        reveals[i].classList.add('active');
      }
      else {
        reveals[i].classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', revealRight);

  function revealRight() {
    let reveals = document.querySelectorAll('.revealRight');
    for (let i = 0; i < reveals.length; i++) {
      let windowheight = window.innerHeight;
      let revealTop = reveals[i].getBoundingClientRect().top;
      let revealPoint = 100;

      if (revealTop < windowheight - revealPoint) {
        reveals[i].classList.add('active');
      }
      else {
        reveals[i].classList.remove('active');
      }
    }
  }


  const hTitle = document.querySelector('.title');
  const hItems = document.querySelector('.items');
  const arrowUp = document.querySelector('.arrow');

  hTitle.addEventListener('click', () => {
    hItems.classList.toggle('active');
    arrowUp.classList.toggle('arrowDown');

  });

  // hTitle.addEventListener('mouseover', () => {
  //   hItems.classList.add('active');
  //   arrowUp.classList.add('arrowDown');
  // });

  // hTitle.addEventListener('mouseout', () => {
  //   hItems.classList.remove('active');
  //   arrowUp.classList.remove('arrowDown');
  // });

  // hItems.addEventListener('mouseover', () => {
  //   hItems.classList.add('active');
  //   arrowUp.classList.add('arrowDown');
  // });

  // hItems.addEventListener('mouseout', () => {
  //   hItems.classList.remove('active');
  //   arrowUp.classList.remove('arrowDown');
  // });

  const imgInp = document.querySelector('.previewInput');
  const imgPreview = document.querySelector('#imgPreview');

  if (imgInp && imgPreview) {
    imgInp.onchange = () => {
      const [file] = imgInp.files;
      if (file) {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        imgPreview.innerHTML = '';
        imgPreview.appendChild(image);
      }
    };
  }

});








