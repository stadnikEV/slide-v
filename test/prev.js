import SlideV from '../src/slide-v';

export default function () {
  window.describe('PREV', () => {
    let result = {};
    let mySlideV = null;


    window.describe('default config. Moving from last index to the left.', () => {
      window.it('create DOM structure', (done) => {
        result = {
          isAnimated: false,
          index: null,
        };
        mySlideV = new SlideV({
          containerSelector: '.carousel',
          transitionDuration: 40,
          slideElemClass: 'slide',
          movingElemClass: 'movingContainer',
          onChange: () => { result.isAnimated = true; },
        });
        mySlideV.next({ step: 10 });
        done();
      });
    });
  });
}
