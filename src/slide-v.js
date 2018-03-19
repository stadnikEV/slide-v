import isCorrectContainerStructure from './utils/is-correct-container-structure';
import setDefaultPropertyOfConfig from './utils/set-default-property-of-config';


export default class SlideV {
  constructor(config) {
    if (!isCorrectContainerStructure(config)) return;
    this._config = setDefaultPropertyOfConfig(config);
    this._containerElem = this._config.containerSelector;
    this._callback = () => {}; // сохраняет колбек который передается при вызове API. Используется в обработчике окончания css анимации onTransitionEnd
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._init();
  }


  _init() {
    this._isInit = true; // запрещает вызов любых API после вызова destoty({ initialMarkup })
    this._buffer = []; // буфер в который помещаются API в ожидании своей очереди
    this._position = 0;
    this._numberSlidesAfterFrame = this._containerElem.children.length - this._config.slidesInFrame;
    this._createDomStructure();
    this._eventSubscribe();
  }


  _createDomStructure() {
    this._containerElem.style.overflow = 'hidden';
    this._containerElem.style.position = 'relative';

    this._movingElem = document.createElement('div'); // элемент который перемещается внутри containerElem
    this._movingElem.style.position = 'relative';
    this._movingElem.style.whiteSpace = 'nowrap';
    this._movingElem.style.left = '0';
    this._movingElem.style.transitionProperty = 'left';

    if (this._config.movingElemClass) {
      this._movingElem.classList.add(this._config.movingElemClass);
    }

    const numberSlidesInContainerElem = this._containerElem.children.length;

    for (let i = 0; i < numberSlidesInContainerElem; i += 1) { // поместить дочерние элементы из containerElem в movingElem
      const slideElem = this._containerElem.firstElementChild;
      this._setCssSlideElem(slideElem);
      this._movingElem.append(slideElem);
    }
    this._containerElem.prepend(this._movingElem);

    return this._containerElem;
  }


  _takeStep({ step, isAnimated = true, callback }) {
    if (typeof callback === 'function') { // сохраняет колбек в переменную для вызова в обработчике окончания css анимации onTransitionEnd
      this._callback = callback;
    }
    this._inProgress = true;
    const availableStep = this._getAvailableStep(step); // максимальное количество слайдов для перемещения

    const curentStep = (Math.abs(step) < availableStep) // количество перемещаемых слайдов на данном шаге
      ? step
      : availableStep * Math.sign(step);

    if (curentStep === 0) {
      this._callbackHandler({ callback: this._callback }); // this._callback -  callback функция которая была сохраненнена при вызове API метода
      this._inProgress = false;
      this._callApiFromBuffer(); // запустить следующее API из буфера

      return curentStep;
    }

    this._position += curentStep;
    this._numberSlidesAfterFrame += -curentStep;

    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const positionLeft = -this._position * slideWidth;
    this._movingElem.style.left = `${positionLeft}px`;
    this._movingElem.style.transitionDuration = `${this._config.transitionDuration}ms`;

    if (!isAnimated) {
      this._movingElem.style.transitionDuration = ''; // Duration = 1ms. Дергается!!!
      this._callbackHandler({ callback: this._callback }); // this._callback - сохраненный callback при вызове API метода
      this._inProgress = false;
      this._callApiFromBuffer();
    }

    this._lastSlideWidth = slideWidth; // необходимо для onResize
    this._curentStep = curentStep; // необходимо для onResize

    return curentStep;
  }

  /*
  * Обработчик события окончания css анимации
  */

  _onTransitionEnd() {
    this._config.onMoveEnd();
    this._callbackHandler({ callback: this._callback }); // this._callback - сохраненный callback при вызове API метода
    this._inProgress = false;
    this._callApiFromBuffer(); // запустить следующее API из буфера
  }

  _callbackHandler({ callback }) {
    if (typeof callback === 'function') {
      this._callbackBuffer = []; // вспомогательный временный буфер. Необходим для помещения API из callback в основной буфер
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer); // добавление API методов из callback в основной буфер
      this._callbackBuffer = null;
      this._callback = null;
    }
  }

  _callApiFromBuffer() { // вызов следующего API метода из буфера
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
    return this._takeStep({ step, isAnimated, callback });
  }


  _insertPrepend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.prepend(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // проверить добавился ли элемент
      this._numberSlidesAfterFrame += 1;
    }

    this._callbackHandler({ callback });
    this._callApiFromBuffer();

    return slideElem;
  }


  _insertAppend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.append(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // проверить добавился ли элемент
      this._numberSlidesAfterFrame += 1;
    }
    this._callbackHandler({ callback });
    this._callApiFromBuffer();

    return slideElem;
  }


  _insertBeforeSlideElem({ slideElem, index, callback }) {
    if (index < 0 || index > this._movingElem.children.length - 1) {
      console.warn('slide-V error: slideElem cannot be inserted. This index does not exists');
      this._callApiFromBuffer();

      return false;
    }

    const lastNumberSlidesInMovingElem = this._movingElem.children.length;
    this._setCssSlideElem(slideElem);
    this._movingElem.children[index].before(slideElem);

    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) { // проверить добавился ли элемент
      this._numberSlidesAfterFrame += 1;
    }
    this._callbackHandler({ callback });
    this._callApiFromBuffer();

    return slideElem;
  }


  _removeSlideElem({ index, callback }) {
    if (index < 0
      || index > this._movingElem.children.length - 1) {
      console.warn('slide-V error: slideElem cannot be deleted. This index does not exists');
      this._callApiFromBuffer();

      return false;
    }
    this._numberSlidesAfterFrame -= 1;
    const removedElem = this._movingElem.removeChild(this._movingElem.children[index]);
    this._removeCssSlideElem(removedElem);
    this._callbackHandler({ callback });
    this._callApiFromBuffer();

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
    this._callbackHandler({ callback });

    return this._containerElem;
  }


  _onClick(event) {
    this._config.onSlideClick(event.target.closest('.slide-v_slide'));
  }


  _onResize() {
    if (this._inProgress) {
      this._dynamicAdaptationStructure();
    } else {
      this._movingElem.style.transitionDuration = '';
      const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
      this._movingElem.style.left = `${-this._position * slideWidth}px`;
    }
  }

  _dynamicAdaptationStructure() { // изменение ширины слайдов и положения movingElem в процессе перемежения
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const endPositionLeft = -(this._position * slideWidth); // позиция в которую перемещается movingElem
    const slideWidthCoefficient = slideWidth / this._lastSlideWidth; // насколько изменилась ширина слайда по сравнению с последним событием onResize
    const startPositionLeft = endPositionLeft + (this._curentStep * slideWidth); // позиция с которой перемещается movingElem
    let curentPositionLeft = parseFloat(getComputedStyle(this._movingElem).left); // текущая позиция movingElem
    curentPositionLeft *= slideWidthCoefficient; // требуемая текущая позиция movingElem c с учетом изменения ширины слайда

    this._movingElem.style.left = `${curentPositionLeft}px`; // изменение текущего положения movingElem с учетом изменения ширины слайда
    this._movingElem.style.transitionDuration = ''; // перемещение в новое положение curentPositionLeft должно быть без анимации

    // текущий коэфициент прогресса перемещения от startPositionLeft до endPositionLeft
    const progressMovingCoefficient = (endPositionLeft - curentPositionLeft) / (endPositionLeft - startPositionLeft);

    this._lastSlideWidth = slideWidth;

    this._timerResize = setTimeout(() => { // после корректировки положения movingElem, запускаем анимацию с новым значением transitionDuration
      // изменение скорости премещения movingElem в соответствии с коэфициент прогресса перемещения
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration * progressMovingCoefficient}ms`;
      this._movingElem.style.left = `${endPositionLeft}px`;
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


  _initApi({ method, options }) {
    if (!this._isInit) { // запрещает использование API после destroy()
      return false;
    }
    if (this._callbackBuffer) { // если был создан callbackBuffer поместить внего API. временный callbackBuffer создается при вызове колбека.
      this._callbackBuffer.push(method.bind(this, options));

      return this._callbackBuffer;
    }
    if (this._inProgress) { // если карусель находится в движении(асинхронный процесс), поместить API в буфер
      this._buffer.push(method.bind(this, options));

      return this._buffer;
    }
    method.call(this, options); // вызвать API не помещая в буфер

    return true;
  }


  /*
  *     API
  */


  getState() {
    return {
      curentSlideIndex: this._position,
      numberSlidesAfterFrame: this._numberSlidesAfterFrame,
      lastSlideIndex: (this._position + this._config.slidesInFrame + this._numberSlidesAfterFrame) - 1,
    };
  }


  next({ step = this._config.step, isAnimated = true, callback } = {}) {
    this._initApi({
      method: this._takeStep,
      options: { step, isAnimated, callback },
    });
    return this;
  }


  prev({ step = this._config.step, isAnimated = true, callback } = {}) {
    this._initApi({
      method: this._takeStep,
      options: { step: -step, isAnimated, callback },
    });
    return this;
  }


  goTo(position = 0, { isAnimated = true, callback } = {}) {
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
