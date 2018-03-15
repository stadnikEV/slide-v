import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');


const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  slidesInFrame: 1,
  step: 1,
  transitionDuration: 1000,
  slideElemClass: 'slide',
  movingElemClass: 'movingContainer',
  onMoveEnd: () => {},
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

mySlideV.goTo(3);
mySlideV.goTo();
