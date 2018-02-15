
import Loop from './loop';
import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');


const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  slidesInFrame: 2,
  // step: 2,
  transitionDuration: 500,
  slideElemClass: 'slide',
  movingElemClass: 'movingContainer',
  onInit: () => { console.warn('Init'); },
  onChange: (curentIndex, numberElemAfterFrame) => {
    console.log(`curentIndex: ${curentIndex},  numberElemAfterFrame: ${numberElemAfterFrame}`);
  },
  onClick(elem) {
    console.log(elem);
  },
});

const myLoop = new Loop({
  slideV: mySlideV,
  step: 2,
});

next.addEventListener('click', () => {
  myLoop.next();
});
prev.addEventListener('click', () => {
  myLoop.prev();
});
