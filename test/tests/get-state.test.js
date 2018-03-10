import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;


  window.describe('getState( ) - return object with current position of carousel..', () => {
    window.it(`getState( ) for new SlideV({ defaultConfig }) - expected result: { curentSlideIndex: 0, numberSlidesAfterFrame: 4, lastSlideIndex: 4 }
      `, (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const state = mySlideV.getState();
      chai.assert.equal(state.curentSlideIndex, 0);
      chai.assert.equal(state.numberSlidesAfterFrame, 4);
      chai.assert.equal(state.lastSlideIndex, 4);
      done();
    });


    window.it(`getState( ) for new SlideV({ slidesInFrame: 3 }) - expected result: { curentSlideIndex: 0, numberSlidesAfterFrame: 2, lastSlideIndex: 4 }
      `, (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        slidesInFrame: 3,
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const state = mySlideV.getState();
      chai.assert.equal(state.curentSlideIndex, 0);
      chai.assert.equal(state.numberSlidesAfterFrame, 2);
      chai.assert.equal(state.lastSlideIndex, 4);
      done();
    });


    window.it(`getState( )'for new SlideV({ slidesInFrame: 5 }) - expected result: { curentSlideIndex: 0, numberSlidesAfterFrame: 0, lastSlideIndex: 4 }
      `, (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        slidesInFrame: 5,
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const state = mySlideV.getState();
      chai.assert.equal(state.curentSlideIndex, 0);
      chai.assert.equal(state.numberSlidesAfterFrame, 0);
      chai.assert.equal(state.lastSlideIndex, 4);
      done();
    });
  });
}
