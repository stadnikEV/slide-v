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

    window.it('added the same element twice', (done) => {
      containerElem.innerHTML = '<div>slide 0</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        slideElemClass: 'slide',
      });
      const newElem = document.createElement('div');
      newElem.innerHTML = 'new Slide';

      mySlideV.insert(newElem, 0);
      mySlideV.insert(newElem, 0);

      chai.assert.equal(mySlideV.getState().lastSlideIndex, 1, 'getState().lastSlideIndex is not equal to 1');

      done();
    });


    window.it('passed API to parameters of insert (callback test)', (done) => {
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

      mySlideV.insert(newElem1, 0, {
        callback: () => {
          mySlideV.prepend(newElem2, 0);
          mySlideV.prepend(newElem3, 0);
        },
      });

      mySlideV.prepend(newElem4, 0);

      const movingElem = containerElem.firstElementChild;

      chai.assert.equal(movingElem.children[0].innerHTML, 'new Slide 4', 'element with index = 0 is not equal to "new Slide 4" ');
      chai.assert.equal(movingElem.children[1].innerHTML, 'new Slide 3', 'element with index = 1 is not equal to "new Slide 3" ');
      chai.assert.equal(movingElem.children[2].innerHTML, 'new Slide 2', 'element with index = 2 is not equal to "new Slide 2" ');
      chai.assert.equal(movingElem.children[3].innerHTML, 'new Slide 1', 'element with index = 3 is not equal to "new Slide 1" ');

      done();
    });
  });
}
