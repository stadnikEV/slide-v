import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const carousel = document.querySelector('.my-carousel');

const mySlideV = new SlideV({
  containerSelector: carousel,
  slidesInFrame: 1,
  step: 1,
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
