const hTitle = document.querySelector('.title');
const hItems = document.querySelector('.items');
const arrowUp = document.querySelector('.arrow');
const body = document.querySelector('body');

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
closeBtn.addEventListener('click', () => {
  const alert = document.querySelector('#alert');
  alert.style.display = 'none';
});


