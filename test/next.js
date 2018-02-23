import SlideV from '../src/slide-v';

export default function () {
  window.describe('NEXT', () => {
    let result = {};
    let mySlideV = null;

    window.describe('default config. Moving from index 0 to the right.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          containerSelector: '.carousel',
          transitionDuration: 40,
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        done();
      });
      window.it('next() ---- expected result: (step = 1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 2, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 3, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 4, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 0, index = 4, animation = false)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -1 }) ---- expected result: (step = -1, index = 3, animation = true)', (done) => {
        mySlideV.next({
          step: -1,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -2, isAnimated: false }) ---- expected result: (step = -2, index = 1, animation = false)', (done) => {
        mySlideV.next({
          step: -2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -3 }) ---- expected result: (step = -1, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -4 }) ---- expected result: (step = 0, index = 0, animation = false)', (done) => {
        mySlideV.next({
          step: -4,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1 }) ---- expected result: (step = 1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          step: 1,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2 }) ---- expected result: (step = 2, index = 3, animation = true)', (done) => {
        mySlideV.next({
          step: 2,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3 }) ---- expected result: (step = 1, index = 4, animation = true)', (done) => {
        mySlideV.next({
          step: 3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 4 }) ---- expected result: (step = 0, index = 4, animation = false)', (done) => {
        mySlideV.next({
          step: 4,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -4 }) ---- expected result: (step = -4, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -4,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 1, index = 1, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 1, index = 2, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 1, index = 3, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 1, index = 4, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 0, index = 4, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -4 }) ---- expected result: (step = -4, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -4,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1, isAnimated: false }) ---- expected result: (step = 1, index = 1, animation = false)', (done) => {
        mySlideV.next({
          step: 1,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2, isAnimated: false }) ---- expected result: (step = 2, index = 3, animation = false)', (done) => {
        mySlideV.next({
          step: 2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3, isAnimated: false }) ---- expected result: (step = 1, index = 4, animation = false)', (done) => {
        mySlideV.next({
          step: 3,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 4, isAnimated: false }) ---- expected result: (step = 0, index = 4, animation = false)', (done) => {
        mySlideV.next({
          step: 4,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 4 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('destroy DOM structure', (done) => {
        mySlideV.destroy({ initialMarkup: true });
        done();
      });
    });


    window.describe('slidesInFrame: 2. Moving from index 0 to the right.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          slidesInFrame: 2,
          transitionDuration: 40,
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        done();
      });
      window.it('next() ---- expected result: (step = 2, index = 2, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 3, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 0, index = 3, animation = false)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -1 }) ---- expected result: (step = -1, index = 2, animation = true)', (done) => {
        mySlideV.next({
          step: -1,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -2, isAnimated: false }) ---- expected result: (step = -2, index = 0, animation = false)', (done) => {
        mySlideV.next({
          step: -2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -3 }) ---- expected result: (step = 0, index = 0, animation = false)', (done) => {
        mySlideV.next({
          step: -3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1 }) ---- expected result: (step = 1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          step: 1,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2 }) ---- expected result: (step = 2, index = 3, animation = true)', (done) => {
        mySlideV.next({
          step: 2,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3 }) ---- expected result: (step = 0, index = 3, animation = true)', (done) => {
        mySlideV.next({
          step: 3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -3 }) ---- expected result: (step = -3, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 2, index = 2, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 1, index = 3, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 0, index = 3, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -3 }) ---- expected result: (step = -3, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1, isAnimated: false }) ---- expected result: (step = 1, index = 1, animation = false)', (done) => {
        mySlideV.next({
          step: 1,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2, isAnimated: false }) ---- expected result: (step = 2, index = 3, animation = false)', (done) => {
        mySlideV.next({
          step: 2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3, isAnimated: false }) ---- expected result: (step = 0, index = 3, animation = false)', (done) => {
        mySlideV.next({
          step: 3,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('destroy DOM structure', (done) => {
        mySlideV.destroy({ initialMarkup: true });
        done();
      });
    });


    window.describe('slidesInFrame: 3. Moving from index 0 to the right.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          slidesInFrame: 3,
          transitionDuration: 400,
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        done();
      });
      window.it('next() ---- expected result: (step = 2, index = 2, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 0, index = 2, animation = false)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -1 }) ---- expected result: (step = -1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          step: -1,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -2, isAnimated: false }) ---- expected result: (step = -1, index = 0, animation = false)', (done) => {
        mySlideV.next({
          step: -2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -3 }) ---- expected result: (step = 0, index = 0, animation = false)', (done) => {
        mySlideV.next({
          step: -3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1 }) ---- expected result: (step = 1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          step: 1,
          callback: () => {
            console.log(1);
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2 }) ---- expected result: (step = 1, index = 2, animation = true)', (done) => {
        mySlideV.next({
          step: 2,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3 }) ---- expected result: (step = 0, index = 2, animation = false)', (done) => {
        mySlideV.next({
          step: 3,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -2 }) ---- expected result: (step = -2, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -2,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 2, index = 2, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ isAnimated: false }) ---- expected result: (step = 0, index = 2, animation = false)', (done) => {
        mySlideV.next({
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: -2 }) ---- expected result: (step = -2, index = 0, animation = true)', (done) => {
        mySlideV.next({
          step: -2,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 0 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 1, isAnimated: false }) ---- expected result: (step = 1, index = 1, animation = false)', (done) => {
        mySlideV.next({
          step: 1,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 2, isAnimated: false }) ---- expected result: (step = 1, index = 2, animation = false)', (done) => {
        mySlideV.next({
          step: 2,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next({ step: 3, isAnimated: false }) ---- expected result: (step = 0, index = 2, animation = false)', (done) => {
        mySlideV.next({
          step: 3,
          isAnimated: false,
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('destroy DOM structure', (done) => {
        mySlideV.destroy({ initialMarkup: true });
        done();
      });
    });


    window.describe('slidesInFrame: 2, step: 1. Moving from index 0 to the right.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          slidesInFrame: 2,
          step: 1,
          transitionDuration: 40,
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        done();
      });
      window.it('next() ---- expected result: (step = 1, index = 1, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 1 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 2, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 1, index = 3, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 0, index = 3, animation = false)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 3 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('destroy DOM structure', (done) => {
        mySlideV.destroy({ initialMarkup: true });
        done();
      });
    });


    window.describe('slidesInFrame: 3, step: 2. Moving from index 0 to the right.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          slidesInFrame: 3,
          step: 2,
          transitionDuration: 40,
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        done();
      });
      window.it('next() ---- expected result: (step = 2, index = 2, animation = true)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: true, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('next() ---- expected result: (step = 0, index = 2, animation = false)', (done) => {
        mySlideV.next({
          callback: () => {
            result.index = mySlideV.getState().curentSlideIndex;
            window.assert.deepEqual(result, { isAnimated: false, index: 2 });
            result.isAnimated = false;
            done();
          },
        });
      });
      window.it('destroy DOM structure', (done) => {
        mySlideV.destroy({ initialMarkup: true });
        done();
      });
    });
  });
}
