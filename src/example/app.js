import SlideV from '../slide-v';

require('./app.css');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const destroy = document.querySelector('.destroy');


const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  slidesInFrame: 2,
  step: 2,
  transitionDuration: 200,
  slideElemClass: 'slide',
  movingElemClass: 'moving-container',
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
destroy.addEventListener('click', () => {
  mySlideV.destroy({ initialMarkup: true });
});

// mySlideV.goTo(4, { isAnimated: false });
