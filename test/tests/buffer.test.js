import chai from 'chai';
import SlideV from '../../src/slide-v';

export default function () {
  const containerElem = document.querySelector('.carousel');
  let mySlideV = null;
  window.describe('Buffer Test - tests the sequence of API calls', () => {
    window.it('API processed in right order', (done) => {
      containerElem.innerHTML = '<div>slide 0</div> <div>slide 1</div> <div>slide 2</div> <div>slide 3</div> <div>slide 4</div>';
      mySlideV = new SlideV({
        containerSelector: '.carousel',
        transitionDuration: 40,
        slideElemClass: 'slide',
        movingElemClass: 'movingContainer',
      });
      const sequence = [];
      mySlideV.next({
        step: 4,
        callback: () => {
          sequence.push(mySlideV.getState().curentSlideIndex);
        },
      });
      mySlideV.prev({
        step: 2,
        callback: () => {
          sequence.push(mySlideV.getState().curentSlideIndex);
          mySlideV.next({
            step: 1,
            callback: () => {
              sequence.push(mySlideV.getState().curentSlideIndex);
              mySlideV.next({
                step: 1,
                callback: () => {
                  sequence.push(mySlideV.getState().curentSlideIndex);
                },
              });
            },
          });
          mySlideV.prev({
            step: 4,
            callback: () => {
              sequence.push(mySlideV.getState().curentSlideIndex);
            },
          });
        },
      });
      mySlideV.next({
        step: 3,
        callback: () => {
          sequence.push(mySlideV.getState().curentSlideIndex);
          mySlideV.prev({
            step: 3,
            callback: () => {
              sequence.push(mySlideV.getState().curentSlideIndex);
            },
          });
        },
      });
      mySlideV.next({
        step: 1,
        callback: () => {
          sequence.push(mySlideV.getState().curentSlideIndex);
          chai.assert.deepEqual(sequence, [4, 2, 3, 4, 0, 3, 0, 1]);
          done();
        },
      });
    });
  });
}
