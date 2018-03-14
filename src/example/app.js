import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');


let steps = -4;

const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  slidesInFrame: 1,
  step: 1,
  transitionDuration: 1000,
  slideElemClass: 'slide',
  movingElemClass: 'movingContainer',
  onMoveEnd: () => {
    console.log(steps);
    mySlideV.next({
      step: steps,
      callback: () => {
        steps *= -1;
        console.log(2);
      },
    });
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

mySlideV.next({
  step: 4,
});
