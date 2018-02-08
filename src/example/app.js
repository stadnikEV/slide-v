
import SlideV from '../slide-v';

require('./app.css');

const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  transitionDuration: 8000,
  transitionTiming: 'linear',
  startIndex: 1,
  elementsInFrame: 1,
  step: 1,
  onInit: ({ curentIndex, numberElemAfterFrame }) => {
    console.warn(`Init   curentIndex: ${curentIndex},  numberElemAfterFrame: ${numberElemAfterFrame}`);
  },
  onChange: ({ eventName, curentIndex, numberElemAfterFrame }) => {
    console.warn(`onChange: ${eventName},  curentIndex: ${curentIndex},  numberElemAfterFrame: ${numberElemAfterFrame}`);
  },
});

const elem1 = document.createElement('div');
elem1.innerHTML = 'new slide 1';
elem1.classList.add('slide');

const elem2 = document.createElement('div');
elem2.innerHTML = 'new slide 2';
elem2.classList.add('slide');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

prev.addEventListener('click', () => mySlideV.prev());
next.addEventListener('click', () => mySlideV.next());
// mySlideV.remove(5);
// mySlideV.insert(elem2, 0);
// mySlideV.goTo(1);
mySlideV.next();
// mySlideV.prev();
// mySlideV.next();
mySlideV.destory();

// setTimeout(() => {
//   mySlideV.init();
//   // mySlideV.next();
//   mySlideV.adjust(1);
// }, 5000);
