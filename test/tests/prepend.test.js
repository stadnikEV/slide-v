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
        movingElemClass: 'movingContainer',
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
      chai.assert.equal(newElem.style.verticalAlign, 'middle', 'missing style vertical-align="middle"');

      movingElem.removeChild(newElem);

      done();
    });
  });
}