import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;
  let curentIsAnimated = false;

  window.describe(`next({ step, isAnimated, callback }) - slides move to left. If "isAnimated: false" slides moving without animation.
  If "step" exceeds maximum available value, carousel move to available maximum
  position.`, () => {
    /*
    *   config = { default }
    */

    window.it('init - new SlideV({ defaultConfig })', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
        onMoveEnd: () => { curentIsAnimated = true; },
      });
      done();
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 1, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 2, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 2, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: -2 })', (done) => {
      mySlideV.next({
        step: -2,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 0, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: 2 })', (done) => {
      mySlideV.next({
        step: 2,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 2, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: -3, isAnimated: false })', (done) => {
      mySlideV.next({
        step: -3,
        isAnimated: false,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 0, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: 3, isAnimated: false })', (done) => {
      mySlideV.next({
        step: 3,
        isAnimated: false,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 2, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });

    /*
    *   config = { slidesInFrame: 2 }
    */

    window.it('init - new SlideV({ slidesInFrame: 2 })', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slidesInFrame: 2,
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
        onMoveEnd: () => { curentIsAnimated = true; },
      });
      done();
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 2, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 3, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next()', (done) => {
      mySlideV.next({
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 3, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: -3 })', (done) => {
      mySlideV.next({
        step: -3,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 0, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: 1 })', (done) => {
      mySlideV.next({
        step: 1,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 1, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: 3 })', (done) => {
      mySlideV.next({
        step: 3,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, true, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 3, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: -3, isAnimated: false })', (done) => {
      mySlideV.next({
        step: -3,
        isAnimated: false,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 0, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
    window.it('next({ step: 4, isAnimated: false })', (done) => {
      mySlideV.next({
        step: 4,
        isAnimated: false,
        callback: () => {
          const curentIndex = mySlideV.getState().currentSlideIndex;
          chai.assert.equal(curentIsAnimated, false, 'isAnimated not corresponds expected value');
          chai.assert.equal(curentIndex, 3, 'currentSlideIndex not corresponds expected value');
          curentIsAnimated = false;
          done();
        },
      });
    });
  });
}
