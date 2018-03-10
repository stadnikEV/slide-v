import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe(`Init Test - incorrect input data test for "containerSelector".
    Creating DOM structure.`, () => {
    window.it('new SlideV( { } ) - container selector is not defined', (done) => {
      mySlideV = new SlideV({});
      chai.assert.equal(Object.keys(mySlideV).length, 0);
      done();
    });


    window.it('new SlideV({ containerSelector: incorrectData }) - incorrect type of data', (done) => {
      mySlideV = new SlideV({
        containerSelector: 5,
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with number');

      mySlideV = new SlideV({
        containerSelector: null,
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with null');

      mySlideV = new SlideV({
        containerSelector: undefined,
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with undefined');

      mySlideV = new SlideV({
        containerSelector: true,
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with boolean');

      mySlideV = new SlideV({
        containerSelector: {},
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with object');

      mySlideV = new SlideV({
        containerSelector: [],
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with array');

      mySlideV = new SlideV({
        containerSelector: () => {},
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0, 'problem with function');
      done();
    });


    window.it('new SlideV({ containerSelector: ".incorrectSelector" }) - container element is not DOM Element', (done) => {
      mySlideV = new SlideV({
        containerSelector: '.something',
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0);
      done();
    });


    window.it('new SlideV({ containerSelector: ".emptyContainer" }) - container element does not contain elements', (done) => {
      containerElem.innerHTML = '';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
      });
      chai.assert.equal(Object.keys(mySlideV).length, 0);
      done();
    });


    window.it('new SlideV({ containerSelector: ".correctlyContainer" }) - created DOM structure', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      const numberElemInContainer = containerElem.children.length;

      mySlideV = new SlideV({
        containerSelector: '.carousel',
      });

      const movingElem = containerElem.firstElementChild;

      chai.assert.equal(containerElem.children.length, 1, 'problem when creating the "movingElem"');
      chai.assert.equal(movingElem.children.length, numberElemInContainer, 'number of slides does not correspond to the original');

      for (let i = 0; i < movingElem.children.length; i += 1) {
        const elem = movingElem.children[i];
        chai.assert.equal(elem.innerHTML, `slide ${i}`, 'sequence of slides does not correspond to the original');
        chai.assert.equal(elem.classList.contains('slide-v_slide'), true, 'missing class "slide-v_slide"');
        chai.assert.equal(elem.style.display, 'inline-block', 'missing style display="inline-block"');
        chai.assert.equal(elem.style.width, '100%', 'missing style width="100%"');
        chai.assert.equal(elem.style.verticalAlign, 'middle', 'missing style vertical-align="middle"');
      }
      done();
    });
  });
}
