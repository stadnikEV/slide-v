import isCorrectContainerStructure from './utils/is-correct-container-structure';
import setDefaultPropertyOfConfig from './utils/set-default-property-of-config';


export default class SlideV {
  constructor(config) {
    if (!isCorrectContainerStructure(config)) return;
    this._config = setDefaultPropertyOfConfig(config);
    this._containerElem = config.containerSelector;
    this._callback = () => {}; // сохраняем колбек в переменную для вызова в обработчике события
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._init();
  }


  _init() {
    this._isInit = true;
    this._buffer = [];
    this._position = 0;
    this._numberSlidesAfterFrame = this._containerElem.children.length - this._config.slidesInFrame;
    this._createDomStructure();
    this._eventSubscribe();
  }


  _createDomStructure() {
    this._containerElem.style.overflow = 'hidden';
    this._containerElem.style.position = 'relative';

    this._movingElem = document.createElement('div');
    this._movingElem.style.position = 'relative';
    this._movingElem.style.whiteSpace = 'nowrap';
    this._movingElem.style.left = '0';
    this._movingElem.style.transitionProperty = 'left';
    this._movingElem.style.transitionDuration = `${this._config.transitionDuration}ms`;
    if (this._config.movingElemClass) {
      this._movingElem.classList.add(this._config.movingElemClass); // пустая строка не работает
    }

    const numberSlidesInContainerElem = this._containerElem.children.length;

    for (let i = 0; i < numberSlidesInContainerElem; i += 1) {
      const slideElem = this._containerElem.firstElementChild;
      this._setCssSlideElem(slideElem);
      this._movingElem.appendChild(slideElem);
    }
    this._containerElem.prepend(this._movingElem);

    return this._containerElem;
  }


  _makeStep({ step, isAnimated = true, callback }) {
    if (typeof callback === 'function') { // сохраняем колбек в переменную для вызова в обработчике события
      this._callback = callback;
    }

    this._inProgress = true;

    const availableStep = this._getAvailableStep(step);

    const curentStep = (Math.abs(step) < availableStep)
      ? step
      : availableStep * Math.sign(step);

    if (curentStep === 0) {
      this._onTransitionEnd({ isOnMoveEnd: false }); // думаю можно вызвать обработчик, событие тут не нужно
      return curentStep;
    }

    this._position += curentStep;
    this._numberSlidesAfterFrame += -curentStep;

    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const endPositionLeft = -this._position * slideWidth;
    this._movingElem.style.left = `${endPositionLeft}px`;
    this._movingElem.style.transitionDuration = `${this._config.transitionDuration}ms`;

    if (!isAnimated) {
      this._movingElem.style.transitionDuration = ''; // проблема с Duration = 1ms. Заметно дерганье
      this._onTransitionEnd({ isOnMoveEnd: false });
    }

    this._lastSlideWidth = slideWidth; // необходимо для onResize
    this._step = curentStep; // необходимо для onResize

    return curentStep;
  }


  _onTransitionEnd({ isOnMoveEnd = true } = {}) {
    if (isOnMoveEnd) this._onMoveEnd();

    if (typeof this._callback === 'function') {
      this._callbackBuffer = [];
      this._callback();
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
      this._callback = null;
    }

    this._inProgress = false;

    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }
  }


  _getAvailableStep(step) {
    return (Math.sign(step) === 1)
      ? this._numberSlidesAfterFrame
      : this._position;
  }


  _setCssSlideElem(slideElem) {
    slideElem.style.display = 'inline-block';
    slideElem.style.width = `${100 / this._config.slidesInFrame}%`;
    slideElem.classList.add('slide-v_slide');
    if (this._config.slideElemClass) {
      slideElem.classList.add(this._config.slideElemClass);
    }
  }

  _removeCssSlideElem(slideElem) {
    slideElem.style.display = '';
    slideElem.style.width = '';
    slideElem.classList.remove('slide-v_slide');
    if (this._config.slideElemClass) {
      slideElem.classList.remove(this._config.slideElemClass);
    }
  }


  _goToPosition({ position, isAnimated, callback }) {
    const step = position - this._position;
    return this._makeStep({ step, isAnimated, callback });
  }


  _insertPrepend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.prepend(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // если случайно добавить один и тот же элемент
      this._numberSlidesAfterFrame += 1;
    }

    if (typeof callback === 'function') {
      this._callbackBuffer = [];
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
    }

    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }
    return slideElem;
  }


  _insertAppend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.append(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // если случайно добавить один и тот же элемент
      this._numberSlidesAfterFrame += 1;
    }

    if (typeof callback === 'function') {
      this._callbackBuffer = [];
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
    }

    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }
    return slideElem;
  }


  _insertBeforeSlideElem({ slideElem, index, callback }) {
    if (index < 0 || index > this._movingElem.children.length - 1) {
      console.warn('slide-V error: slideElem cannot be inserted. This index does not exists');

      if (this._buffer.length > 0) {
        const method = this._buffer.shift();
        method();
      }

      return false;
    }

    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.children[index].before(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // если случайно добавить один и тот же элемент
      this._numberSlidesAfterFrame += 1;
    }

    if (typeof callback === 'function') {
      this._callbackBuffer = [];
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
    }

    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }

    return slideElem;
  }


  _removeSlideElem({ index, callback }) {
    if (index < 0
      || index > this._movingElem.children.length - 1) {
      console.warn('slide-V error: slideElem cannot be deleted. This index does not exists');

      if (this._buffer.length > 0) {
        const method = this._buffer.shift();
        method();
      }

      return false;
    }

    this._numberSlidesAfterFrame -= 1;
    const removedElem = this._movingElem.removeChild(this._movingElem.children[index]);
    this._removeCssSlideElem(removedElem);

    if (typeof callback === 'function') {
      this._callbackBuffer = [];
      callback(removedElem);
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
    }

    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }

    return removedElem;
  }


  _destoryDomStructure() {
    const numberSlidesInMovingElem = this._movingElem.children.length;
    for (let i = 0; i < numberSlidesInMovingElem; i += 1) {
      const slideElem = this._movingElem.firstElementChild;
      this._removeCssSlideElem(slideElem);
      this._containerElem.appendChild(slideElem);
    }

    this._containerElem.style.overflow = '';
    this._containerElem.style.position = '';
    this._containerElem.removeChild(this._movingElem);

    this._movingElem = null;

    return this._containerElem;
  }


  _deactivation({ initialMarkup, callback } = {}) {
    this._isInit = false;
    this._buffer = [];
    this._eventUnsubscribe();
    if (initialMarkup) this._destoryDomStructure();

    if (typeof callback === 'function') {
      this._callbackBuffer = [];
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer);
      this._callbackBuffer = null;
    }
    return this._containerElem;
  }


  _onMoveEnd() {
    this._config.onMoveEnd();
  }


  _onClick(event) {
    this._config.onSlideClick(event.target.closest('.slide-v_slide'));
  }


  _onResize() {
    if (this._inProgress) { // при медленном перемещении (10с), подвигай окно браузера
      const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
      const endPositionLeft = -(this._position * slideWidth);
      const slideWidthCoefficient = slideWidth / this._lastSlideWidth;
      const startPositionLeft = endPositionLeft + (this._step * slideWidth);

      this._movingElem.style.left = `${parseFloat(getComputedStyle(this._movingElem).left) * slideWidthCoefficient}px`;
      this._movingElem.style.transitionDuration = '';

      const progressMovingCoefficient = (endPositionLeft - parseFloat(getComputedStyle(this._movingElem).left)) / (endPositionLeft - startPositionLeft);

      this._lastSlideWidth = slideWidth;

      clearTimeout(this._timerResize);

      this._timerResize = setTimeout(() => {
        this._movingElem.style.transitionDuration = `${this._config.transitionDuration * progressMovingCoefficient}ms`;
        this._movingElem.style.left = `${endPositionLeft}px`;
      }, 0);

      return;
    }
    this._movingElem.style.transitionDuration = '';
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    this._movingElem.style.left = `${-this._position * slideWidth}px`;
    setTimeout(() => {
      this._onTransitionEnd({ isOnMoveEnd: false });
    }, 0);
  }


  _eventSubscribe() {
    window.addEventListener('resize', this._onResize);
    this._movingElem.addEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.addEventListener('click', this._onClick);
  }


  _eventUnsubscribe() {
    window.removeEventListener('resize', this._onResize);
    this._movingElem.removeEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.removeEventListener('click', this._onClick);
  }


  _initApi({ method, options }) { // может неудачное название метода
    if (!this._isInit) {
      return false;
    }
    if (this._callbackBuffer) {
      this._callbackBuffer.push(method.bind(this, options));

      return this._callbackBuffer;
    }
    if (this._inProgress) {
      this._buffer.push(method.bind(this, options));

      return this._buffer;
    }
    method.call(this, options);

    return true;
  }


  getState() {
    return {
      curentSlideIndex: this._position,
      numberSlidesAfterFrame: this._numberSlidesAfterFrame,
      lastSlideIndex: (this._position + this._config.slidesInFrame + this._numberSlidesAfterFrame) - 1,
    };
  }


  next({ step = this._config.step, isAnimated = true, callback } = {}) {
    this._initApi({
      method: this._makeStep,
      options: { step, isAnimated, callback },
    });
    return this;
  }


  prev({ step = this._config.step, isAnimated = true, callback } = {}) {
    this._initApi({
      method: this._makeStep,
      options: { step: -step, isAnimated, callback },
    });
    return this;
  }


  goTo(position, { isAnimated = true, callback } = {}) {
    this._initApi({
      method: this._goToPosition,
      options: { position, isAnimated, callback },
    });
    return this;
  }


  append(slideElem, { callback } = {}) {
    this._initApi({
      method: this._insertAppend,
      options: { slideElem, callback },
    });
    return this;
  }


  prepend(slideElem, { callback } = {}) {
    this._initApi({
      method: this._insertPrepend,
      options: { slideElem, callback },
    });
    return this;
  }


  insert(slideElem, index, { callback } = {}) {
    this._initApi({
      method: this._insertBeforeSlideElem,
      options: { slideElem, index, callback },
    });
    return this;
  }


  remove(index, { callback } = {}) {
    this._initApi({
      method: this._removeSlideElem,
      options: { index, callback },
    });
    return this;
  }


  destroy({ initialMarkup, callback } = {}) {
    this._initApi({
      method: this._deactivation,
      options: { initialMarkup, callback },
    });
    return this;
  }
}
