import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe(`insert(slideElem, index, { callback }) - adds new slide to the position with the specified index.
  If a slide with such an index is missing, slide is not added.`, () => {
    const testAddingElement = ({ index }) => {
      window.it(`insert(newElem, ${index}) - element added`, (done) => {
        containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
        mySlideV = new SlideV({
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
        });
        const newElem = document.createElement('div');
        newElem.innerHTML = 'new Slide';

        mySlideV.insert(newElem, index);

        const movingElem = containerElem.firstElementChild;
        const expectedElement = movingElem.children[index];

        chai.assert.equal(expectedElement, newElem, 'element does not found at the end position of movingElem');
        chai.assert.equal(newElem.classList.contains('slide-v_slide'), true, 'missing class "slide-v_slide"');
        chai.assert.equal(newElem.style.display, 'inline-block', 'missing style display="inline-block"');
        chai.assert.equal(newElem.style.width, '100%', 'missing style width="100%"');
        chai.assert.equal(newElem.style.verticalAlign, 'middle', 'missing style vertical-align="middle"');
        done();
      });
    };


    const testNotAddingElement = ({ index }) => {
      window.it(`insert(newElem, ${index}) - element not added`, (done) => {
        containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';

        mySlideV = new SlideV({
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
        });
        const newElem = document.createElement('div');
        newElem.innerHTML = 'new Slide';

        mySlideV.insert(newElem, index);

        const movingElem = containerElem.firstElementChild;

        if (movingElem.children.length === 6) {
          chai.assert.equal(movingElem.children.length, 5, 'new element was added');
        }
        done();
      });
    };

    for (let i = 0; i < 5; i += 1) {
      testAddingElement({ index: i });
    }

    for (let i = -1; i > -5; i -= 3) {
      testNotAddingElement({ index: i });
    }

    for (let i = 5; i < 9; i += 3) {
      testNotAddingElement({ index: i });
    }
  });
}
