import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe('prepend(slideElem, { callback }) - adds a new slide element to the beginning of carousel.', () => {
    window.it('slide element was added', (done) => {
      containerElem.innerHTML = '<div>slide 0</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
      });
      const newElem = document.createElement('div');
      newElem.innerHTML = 'new Slide';

      mySlideV.prepend(newElem);

      const movingElem = containerElem.firstElementChild;
      const firstElem = movingElem.firstElementChild;

      chai.assert.equal(firstElem, newElem, 'element does not found at the first position of movingElem');
      chai.assert.equal(newElem.classList.contains('slide-v_slide'), true, 'missing class "slide-v_slide"');
      chai.assert.equal(newElem.style.display, 'inline-block', 'missing style display="inline-block"');
      chai.assert.equal(newElem.style.width, '100%', 'missing style width="100%"');

      done();
    });


    window.it('added the same element twice', (done) => {
      containerElem.innerHTML = '<div>slide 0</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
      });
      const newElem = document.createElement('div');
      newElem.innerHTML = 'new Slide';

      mySlideV.prepend(newElem);
      mySlideV.prepend(newElem);

      chai.assert.equal(mySlideV.getState().lastSlideIndex, 1, 'getState().lastSlideIndex is not equal to 1');

      done();
    });


    window.it('passed API to parameters of prepend (callback test)', (done) => {
      containerElem.innerHTML = '<div>slide 0</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
      });
      const newElem1 = document.createElement('div');
      newElem1.innerHTML = 'new Slide 1';

      const newElem2 = document.createElement('div');
      newElem2.innerHTML = 'new Slide 2';

      const newElem3 = document.createElement('div');
      newElem3.innerHTML = 'new Slide 3';

      const newElem4 = document.createElement('div');
      newElem4.innerHTML = 'new Slide 4';

      mySlideV.prepend(newElem1, {
        callback: () => {
          mySlideV.prepend(newElem2);
          mySlideV.prepend(newElem3);
        },
      });

      mySlideV.prepend(newElem4);

      const movingElem = containerElem.firstElementChild;

      chai.assert.equal(movingElem.children[0].innerHTML, 'new Slide 4', 'element with index = 0 is not equal to "new Slide 4" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'new Slide 3', 'element with index = 1 is not equal to "new Slide 3" ');
      chai.assert.equal(movingElem.children[2].innerHTML, 'new Slide 2', 'element with index = 2 is not equal to "new Slide 2" ');
      chai.assert.equal(movingElem.children[3].innerHTML, 'new Slide 1', 'element with index = 3 is not equal to "new Slide 1" ');

      done();
    });
  });
}
