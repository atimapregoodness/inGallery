document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');


  const zoomInButton = document.querySelector('#zoomIn');
  const zoomOutButton = document.querySelector('#zoomOut');
  const zoomableImage = document.querySelector('#zoomableImage');
  const zoomInOut = document.querySelector('#zoomInOut');
  const resetBtn = document.querySelector('#resetBtn');

  if (zoomInButton && zoomOutButton && zoomableImage && zoomInOut && resetBtn) {
    const scaleFactor = 30;
    const originalSize = 15;


    zoomInOut.addEventListener('change', function () {
      zoomInValue = zoomInOut.value;
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    zoomInButton.addEventListener('click', function () {
      zoomInOut.value = parseInt(zoomInOut.value) + scaleFactor;

      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    zoomOutButton.addEventListener('click', function () {
      zoomInOut.value = Math.max(15, zoomInOut.value - scaleFactor); // Prevent scaling below the original size
      zoomableImage.style.width = `${zoomInOut.value}em`;
    });

    resetBtn.addEventListener('click', () => {
      zoomInOut.value = originalSize;
      zoomableImage.style.width = `${originalSize}em`;

    });
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


  window.addEventListener('scroll', reveal);
  function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 100;

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
    var reveals = document.querySelectorAll('.revealRight');
    for (var i = 0; i < reveals.length; i++) {
      var windowheight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 100;

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
  const body = document.querySelector('body');

  hTitle.addEventListener('mouseover', () => {
    hItems.classList.add('active');
    arrowUp.classList.add('arrowDown');
  });

  hTitle.addEventListener('mouseout', () => {
    hItems.classList.remove('active');
    arrowUp.classList.remove('arrowDown');
  });

  hItems.addEventListener('mouseover', () => {
    hItems.classList.add('active');
    arrowUp.classList.add('arrowDown');
  });

  hItems.addEventListener('mouseout', () => {
    hItems.classList.remove('active');
    arrowUp.classList.remove('arrowDown');
  });

  const closeBtn = document.querySelector('#closeBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const alert = document.querySelector('#alert');
      alert.style.display = 'none';
    });
  }

});



