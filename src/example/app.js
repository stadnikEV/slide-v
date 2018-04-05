import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const destroy = document.querySelector('.destroy');
const prepend = document.querySelector('.prepend');


const mySlideV = new SlideV({
  containerSelector: '.slide-v',
  slidesInFrame: 1,
  step: 1,
  transitionDuration: 701,
  draggable: true,
  dragThreshold: 0.2,
  slideElemClass: 'slide',
  movingElemClass: 'moving-container',
  onMoveEnd: () => {
    console.log('onMoveEnd');
  },
  onSlideClick(slideElem) {
    console.log(slideElem);
  },
});

const newElem = document.querySelector('.img');

next.addEventListener('click', () => {
  mySlideV.next({ callback: () => { console.log('next'); } });
});
prev.addEventListener('click', () => {
  mySlideV.prev();
});
destroy.addEventListener('click', () => {
  mySlideV.destroy();
});
prepend.addEventListener('click', () => {
  mySlideV.insert(newElem, 0);
});


// mySlideV.next({ step: 2, isAnimated: false, callback: () => { mySlideV.next(); } });
// mySlideV.prev();
