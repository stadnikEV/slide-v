import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe('Looo test', () => {
    /*
    *   config = { default } insufficient number of elements
    */

    window.it('init - new SlideV({ loop: true }) for looping need to increase the number of slides by 1', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        loop: true,
      });
      done();
    });

    window.it('sequence of slide after init is correct (slide 0  slide 1)', (done) => {
      const movingElem = containerElem.firstElementChild;
      chai.assert.equal(movingElem.children[0].innerHTML, 'slide 0', 'element with index = 0 is not equal to "slide 0" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'slide 1', 'element with index = 1 is not equal to "slide 1" ');
      chai.assert.equal(mySlideV.getState().currentSlideIndex, '0', 'currentSlideIndex is not equal to "0" ');
      done();
    });


    /*
    *   config = { default }
    */


    window.it('init - new SlideV({ loop: true })', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        loop: true,
      });
      done();
    });
    window.it('sequence of slide after init is correct (slide 3  slide 0  slide 1  slide 2)', (done) => {
      const movingElem = containerElem.firstElementChild;
      chai.assert.equal(movingElem.children[0].innerHTML, 'slide 3', 'element with index = 0 is not equal to "slide 3" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'slide 0', 'element with index = 1 is not equal to "slide 0" ');
      chai.assert.equal(movingElem.children[2].innerHTML, 'slide 1', 'element with index = 2 is not equal to "slide 1" ');
      chai.assert.equal(movingElem.children[3].innerHTML, 'slide 2', 'element with index = 3 is not equal to "slide 2" ');
      chai.assert.equal(mySlideV.getState().currentSlideIndex, '1', 'currentSlideIndex is not equal to "1" ');
      done();
    });
    window.it('goTo(3) - sequence of slide after init is correct (slide 0   slide 1   slide 2   slide 3)', (done) => {
      mySlideV.goTo(3, {
        callback: () => {
          const movingElem = containerElem.firstElementChild;
          chai.assert.equal(movingElem.children[0].innerHTML, 'slide 0', 'element with index = 0 is not equal to "slide 0"');
          chai.assert.equal(movingElem.children[1].innerHTML, 'slide 1', 'element with index = 1 is not equal to "slide 1"');
          chai.assert.equal(movingElem.children[2].innerHTML, 'slide 2', 'element with index = 2 is not equal to "slide 2"');
          chai.assert.equal(movingElem.children[3].innerHTML, 'slide 3', 'element with index = 3 is not equal to "slide 3"');
          chai.assert.equal(mySlideV.getState().currentSlideIndex, '2', 'currentSlideIndex is not equal to "2"');
          done();
        },
      });
    });
    window.it('next() - sequence of slide after init is correct (slide 1   slide 2   slide 3   slide 0)', (done) => {
      mySlideV.next({
        callback: () => {
          const movingElem = containerElem.firstElementChild;
          chai.assert.equal(movingElem.children[0].innerHTML, 'slide 1', 'element with index = 0 is not equal to "slide 1"');
          chai.assert.equal(movingElem.children[1].innerHTML, 'slide 2', 'element with index = 1 is not equal to "slide 2"');
          chai.assert.equal(movingElem.children[2].innerHTML, 'slide 3', 'element with index = 2 is not equal to "slide 3"');
          chai.assert.equal(movingElem.children[3].innerHTML, 'slide 0', 'element with index = 3 is not equal to "slide 0"');
          chai.assert.equal(mySlideV.getState().currentSlideIndex, '2', 'currentSlideIndex is not equal to "2"');
          done();
        },
      });
    });
    window.it('goTo(0) - sequence of slide after init is correct (slide 1   slide 2   slide 3   slide 0)', (done) => {
      mySlideV.goTo(0, {
        callback: () => {
          const movingElem = containerElem.firstElementChild;
          chai.assert.equal(movingElem.children[0].innerHTML, 'slide 0', 'element with index = 0 is not equal to "slide 0"');
          chai.assert.equal(movingElem.children[1].innerHTML, 'slide 1', 'element with index = 1 is not equal to "slide 1"');
          chai.assert.equal(movingElem.children[2].innerHTML, 'slide 2', 'element with index = 2 is not equal to "slide 2"');
          chai.assert.equal(movingElem.children[3].innerHTML, 'slide 3', 'element with index = 3 is not equal to "slide 3"');
          chai.assert.equal(mySlideV.getState().currentSlideIndex, '1', 'currentSlideIndex is not equal to "1"');
          done();
        },
      });
    });


    /*
    *   config = { elementsInFrame: 2 }
    */


    window.it('init - new SlideV({ loop: true, slidesInFrame: 2 })', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div> <div>slide 5</div>';
      mySlideV = new SlideV({
        slidesInFrame: 2,
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        loop: true,
      });
      done();
    });
    window.it('sequence of slide after init is correct (slide 4  slide 5  slide 0  slide 1 slide 2 slide 3)', (done) => {
      const movingElem = containerElem.firstElementChild;
      chai.assert.equal(movingElem.children[0].innerHTML, 'slide 4', 'element with index = 0 is not equal to "slide 4" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'slide 5', 'element with index = 1 is not equal to "slide 5" ');
      chai.assert.equal(movingElem.children[2].innerHTML, 'slide 0', 'element with index = 2 is not equal to "slide 0" ');
      chai.assert.equal(movingElem.children[3].innerHTML, 'slide 1', 'element with index = 3 is not equal to "slide 1" ');
      chai.assert.equal(movingElem.children[4].innerHTML, 'slide 2', 'element with index = 4 is not equal to "slide 2" ');
      chai.assert.equal(movingElem.children[5].innerHTML, 'slide 3', 'element with index = 5 is not equal to "slide 3" ');
      chai.assert.equal(mySlideV.getState().currentSlideIndex, '2', 'currentSlideIndex is not equal to "2" ');
      done();
    });
    window.it('goTo(0) - sequence of slide after init is correct (slide 2 slide 3 slide 4  slide 5  slide 0  slide 1)', (done) => {
      mySlideV.goTo(0, {
        callback: () => {
          const movingElem = containerElem.firstElementChild;
          chai.assert.equal(movingElem.children[0].innerHTML, 'slide 2', 'element with index = 0 is not equal to "slide 2"');
          chai.assert.equal(movingElem.children[1].innerHTML, 'slide 3', 'element with index = 1 is not equal to "slide 3"');
          chai.assert.equal(movingElem.children[2].innerHTML, 'slide 4', 'element with index = 2 is not equal to "slide 4"');
          chai.assert.equal(movingElem.children[3].innerHTML, 'slide 5', 'element with index = 3 is not equal to "slide 5"');
          chai.assert.equal(movingElem.children[4].innerHTML, 'slide 0', 'element with index = 4 is not equal to "slide 0"');
          chai.assert.equal(movingElem.children[5].innerHTML, 'slide 1', 'element with index = 5 is not equal to "slide 1"');
          chai.assert.equal(mySlideV.getState().currentSlideIndex, '2', 'currentSlideIndex is not equal to "2"');
          done();
        },
      });
    });
    window.it('next() - sequence of slide after init is correct (slide 4  slide 5  slide 0  slide 1 slide 2 slide 3)', (done) => {
      mySlideV.next({
        callback: () => {
          const movingElem = containerElem.firstElementChild;
          chai.assert.equal(movingElem.children[0].innerHTML, 'slide 4', 'element with index = 0 is not equal to "slide 4" ');
          chai.assert.equal(movingElem.children[1].innerHTML, 'slide 5', 'element with index = 1 is not equal to "slide 5" ');
          chai.assert.equal(movingElem.children[2].innerHTML, 'slide 0', 'element with index = 2 is not equal to "slide 0" ');
          chai.assert.equal(movingElem.children[3].innerHTML, 'slide 1', 'element with index = 3 is not equal to "slide 1" ');
          chai.assert.equal(movingElem.children[4].innerHTML, 'slide 2', 'element with index = 4 is not equal to "slide 2" ');
          chai.assert.equal(movingElem.children[5].innerHTML, 'slide 3', 'element with index = 5 is not equal to "slide 3" ');
          chai.assert.equal(mySlideV.getState().currentSlideIndex, '2', 'currentSlideIndex is not equal to "2" ');
          done();
        },
      });
    });


    /*
    *   config = { elementsInFrame: 2 } insufficient number of elements for step = 2
    */


    window.it('init - new SlideV({ loop: true, slidesInFrame: 2 })  insufficient number of elements for step = 2', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        slidesInFrame: 2,
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        loop: true,
      });
      done();
    });
    window.it('sequence of slide after init is correct (slide 5  slide 0  slide 1 slide 2 slide 3 slide 4)', (done) => {
      const movingElem = containerElem.firstElementChild;
      chai.assert.equal(movingElem.children[0].innerHTML, 'slide 4', 'element with index = 0 is not equal to "slide 4" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'slide 0', 'element with index = 1 is not equal to "slide 0" ');
      chai.assert.equal(movingElem.children[2].innerHTML, 'slide 1', 'element with index = 2 is not equal to "slide 1" ');
      chai.assert.equal(movingElem.children[3].innerHTML, 'slide 2', 'element with index = 3 is not equal to "slide 2" ');
      chai.assert.equal(movingElem.children[4].innerHTML, 'slide 3', 'element with index = 4 is not equal to "slide 3" ');
      chai.assert.equal(mySlideV.getState().currentSlideIndex, '1', 'currentSlideIndex is not equal to "1" ');
      done();
    });
  });
}
