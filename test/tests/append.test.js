import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe('append(slideElem, { callback }) - adds a new slide element to the end position of carousel.', () => {
    window.it('slide element was added', (done) => {
      containerElem.innerHTML = '<div>slide 0</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const newElem = document.createElement('div');
      newElem.innerHTML = 'new Slide';

      mySlideV.append(newElem);

      const movingElem = containerElem.firstElementChild;
      const lastElem = movingElem.lastElementChild;

      chai.assert.equal(lastElem, newElem, 'element does not found at the end position of movingElem');
      chai.assert.equal(newElem.classList.contains('slide-v_slide'), true, 'missing class "slide-v_slide"');
      chai.assert.equal(newElem.style.display, 'inline-block', 'missing style display="inline-block"');
      chai.assert.equal(newElem.style.width, '100%', 'missing style width="100%"');

      movingElem.removeChild(newElem);

      done();
    });
  });
}
