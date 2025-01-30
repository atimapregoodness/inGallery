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
closeBtn.addEventListener('click', () => {
  const alert = document.querySelector('#alert');
  alert.style.display = 'none';
});
