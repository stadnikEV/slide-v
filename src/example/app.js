import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const remove = document.querySelector('.remove');

// const carousel = document.querySelector('.my-carousel');

const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  slidesInFrame: 1,
  step: 2,
  transitionDuration: 500,
  slideElemClass: 'slide',
  movingElemClass: 'movingContainer',
  onMoveEnd: () => {
    console.log(mySlideV.getState());
  },
  onSlideClick(slideElem) {
    console.log(slideElem);
  },
});

next.addEventListener('click', () => {
  mySlideV.next();
});
prev.addEventListener('click', () => {
  mySlideV.prev();
});

mySlideV.next();
mySlideV.destroy();
mySlideV.prev();
remove.addEventListener('click', () => {
  mySlideV.destroy();
});
