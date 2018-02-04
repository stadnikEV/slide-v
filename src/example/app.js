
import SlideV from '../slide-v';

require('./app.css');

const mySlideV = new SlideV({
  containerSelector: '.my-carousel',
  transitionDuration: 500,
  transitionTiming: 'linear',
  startIndex: 2,
  elementsInFrame: 1,
  step: 1,
  onInit: () => { console.warn('init'); },
  onChange: ({ curentIndex, numberElemAfterFrame }) => {
    console.warn(`curentIndex: ${curentIndex}`, `numberElemAfterFrame: ${numberElemAfterFrame}`);
  },
});

mySlideV.next();
mySlideV.prev();
// mySlideV.goTo(3);
mySlideV.destory(true);

setTimeout(() => {
  mySlideV.init();
  mySlideV.next();
}, 4000);
