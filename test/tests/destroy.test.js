import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  let mySlideV = null;
  const containerElem = document.querySelector('.carousel');


  window.describe('destroy({ initialMarkup, callback }) - unsubscribe events. Returning DOM structure to the initial state.', () => {
    window.it('DOM structure was destroyed', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const movingElem = containerElem.firstElementChild;
      const numberElemInMovingElemBeforeDestroy = movingElem.children.length;

      mySlideV.destroy({ initialMarkup: true });

      chai.assert.equal(containerElem.children.length, numberElemInMovingElemBeforeDestroy, 'number of slides does not correspond to the original');

      for (let i = 0; i < containerElem.children.length; i += 1) {
        const elem = containerElem.children[i];
        chai.assert.equal(elem.innerHTML, `slide ${i}`, 'sequence of slides does not correspond to the original');
        chai.assert.equal(elem.classList.contains('slide-v_slide'), false, 'missing class "slide-v_slide"');
        chai.assert.equal(elem.style.display, '', 'missing style display="inline-block"');
        chai.assert.equal(elem.style.width, '', 'missing style width="100%"');
        chai.assert.equal(elem.style.verticalAlign, '', 'missing style vertical-align="middle"');
      }
      done();
    });
  });
}
