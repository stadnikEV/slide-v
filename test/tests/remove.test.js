import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;

  window.describe(`remove(index, { callback }) - removing slide at the specified index.
    If a slide with such an index is missing, slide is not removing`, () => {
    const testRemovingElement = ({ index }) => {
      window.it(`remove(${index}) - element removed`, (done) => {
        containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
        mySlideV = new SlideV({
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
        });
        const movingElem = containerElem.firstElementChild;
        const expectedElement = movingElem.children[index];

        mySlideV.remove(index);

        chai.assert.equal(movingElem.children.length, 4, 'element was not deleted');

        for (let i = 0; i < 4; i += 1) {
          chai.assert.notEqual(expectedElement, movingElem.children[i], 'incorrect element was deleted');
        }
        done();
      });
    };


    const testNotRemovingElement = ({ index }) => {
      window.it(`remove(${index}) - element not removed`, (done) => {
        containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
        mySlideV = new SlideV({
          containerSelector: '.carousel',
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
        });
        const movingElem = containerElem.firstElementChild;
        mySlideV.remove(index);
        chai.assert.equal(movingElem.children.length, 5, 'element was deleted');
        done();
      });
    };

    for (let i = 0; i < 5; i += 1) {
      testRemovingElement({ index: i });
    }
    testNotRemovingElement({ index: -1 });
    testNotRemovingElement({ index: 5 });
  });
}
