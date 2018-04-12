import SlideV from '../slide-v';

require('./app.css');


const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const goTo = document.querySelector('.goTo');
const getState = document.querySelector('.getState');
const prepend = document.querySelector('.prepend');
const append = document.querySelector('.append');
const insert = document.querySelector('.insert');
const remove = document.querySelector('.remove');
const destroy = document.querySelector('.destroy');


const prependElem = document.createElement('div');
prependElem.innerHTML = 'prepend';

const appendElem = document.createElement('div');
appendElem.innerHTML = 'append';

const insertElem = document.createElement('div');
insertElem.innerHTML = 'insert';


const mySlideV = new SlideV({
  slidesInFrame: 2,
  step: 2,
  transitionDuration: 300,
  transitionTiming: 'linear',
  draggable: true,
  dragThreshold: 0.2,
  // loop: true,
  slideElemClass: 'slide',
  onMoveEnd: () => {
    console.log('onMoveEnd');
  },
  onSlideClick: (slideElem) => {
    console.log(slideElem);
  },
});


next.addEventListener('click', () => {
  mySlideV.next();
});
prev.addEventListener('click', () => {
  mySlideV.prev();
});
goTo.addEventListener('click', () => {
  mySlideV.goTo(0);
});
getState.addEventListener('click', () => {
  console.log(mySlideV.getState());
});
prepend.addEventListener('click', () => {
  mySlideV.prepend(prependElem);
});
append.addEventListener('click', () => {
  mySlideV.append(appendElem);
});
insert.addEventListener('click', () => {
  mySlideV.insert(insertElem, 1);
});
remove.addEventListener('click', () => {
  mySlideV.remove(0, {
    callback: (param) => {
      console.log(param);
    },
  });
});
destroy.addEventListener('click', () => {
  mySlideV.destroy();
});


// mySlideV.next({ step: 2, isAnimated: false, callback: () => { mySlideV.next(); } });
// mySlideV.prev();
