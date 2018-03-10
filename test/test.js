import './mocha/mocha';

import initSlideVTest from './tests/init-slide-v.test';
import getStateTest from './tests/get-state.test';
import nextTest from './tests/next.test';
import prevTest from './tests/prev.test';
import goToTest from './tests/go-to.test';
import prependTest from './tests/prepend.test';
import appendTest from './tests/append.test';
import insertTest from './tests/insert.test';
import removeTest from './tests/remove.test';
import desroyTest from './tests/destroy.test';
import bufferTest from './tests/buffer.test';


require('./style.css');
require('./mocha/mocha.css');

window.mocha.setup('bdd');


window.describe('SlideV', () => {
  initSlideVTest();
  getStateTest();
  nextTest();
  prevTest();
  goToTest();
  prependTest();
  appendTest();
  insertTest();
  removeTest();
  desroyTest();
  bufferTest();
});

window.mocha.run();
