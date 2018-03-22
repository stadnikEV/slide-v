import isCorrectContainerStructure from './utils/is-correct-container-structure';
import setDefaultPropertyOfConfig from './utils/set-default-property-of-config';


export default class SlideV {
  constructor(config) {
    if (!isCorrectContainerStructure(config)) return;
    this._config = setDefaultPropertyOfConfig(config);
    this._containerElem = this._config.containerSelector;
    this._callback = () => {}; // сохраняет колбек который передается при вызове API. Используется в обработчике окончания css анимации onTransitionEnd
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseOut = this._onMouseOut.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onDragStart = event => event.preventDefault();
    this._onResize = this._onResize.bind(this);
    this._init();
  }


  _init() {
    this._isInit = true; // запрещает вызов любых API после вызова destoty({ initialMarkup })
    this._buffer = []; // буфер в который помещаются API в ожидании своей очереди
    this._curentSlideIndex = 0;
    this._numberSlidesAfterFrame = this._containerElem.children.length - this._config.slidesInFrame;
    this._createDomStructure();
    this._eventSubscribe();
  }


  _createDomStructure() {
    this._containerElem.style.overflow = 'hidden';
    this._containerElem.style.position = 'relative';

    this._movingElem = document.createElement('div'); // элемент который перемещается внутри containerElem
    this._movingElem.setAttribute('data-slide-v-elem', 'moving-elem');
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
    this._inMovingProgress = true;
    const availableStep = this._getAvailableStep(step); // максимальное количество слайдов для перемещения

    const curentStep = (Math.abs(step) < availableStep) // количество перемещаемых слайдов на данном шаге
      ? step
      : availableStep * Math.sign(step);

    if (curentStep === 0) {
      this._callbackHandler({ callback: this._callback }); // this._callback -  callback функция которая была сохраненнена при вызове API метода
      this._inMovingProgress = false;
      this._callApiFromBuffer(); // запустить следующее API из буфера

      return curentStep;
    }

    this._curentSlideIndex += curentStep;
    this._numberSlidesAfterFrame += -curentStep;

    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const positionLeft = -this._curentSlideIndex * slideWidth;
    this._movingElem.style.left = `${positionLeft}px`;
    this._movingElem.style.transitionDuration = `${this._config.transitionDuration}ms`;

    if (!isAnimated) {
      this._movingElem.style.transitionDuration = ''; // Duration = 1ms. Дергается!!!
      this._callbackHandler({ callback: this._callback }); // this._callback - сохраненный callback при вызове API метода
      this._inMovingProgress = false;
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
    this._inMovingProgress = false;

    if (!this._preventOnMoveEnd) { // если необходимо не генерировать событие onMoveEnd но выполнить анимацию
      this._config.onMoveEnd();
    } else {
      this._preventOnMoveEnd = false;
    }
    this._callbackHandler({ callback: this._callback }); // this._callback - сохраненный callback при вызове API метода
    this._callApiFromBuffer(); // запустить следующее API из буфера
  }

  _callbackHandler({ callback }) {
    if (typeof callback === 'function') {
      this._callbackBuffer = []; // вспомогательный временный буфер. Необходим для помещения API из callback в основной буфер
      callback();
      this._buffer = this._callbackBuffer.concat(this._buffer); // добавление API методов из callback в основной буфер
      this._callbackBuffer = null;
      this._callback = () => {};
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
      : this._curentSlideIndex;
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


  _initApi({ method, options }) {
    if (!this._isInit) { // запрещает использование API после destroy()
      return false;
    }
    if (this._callbackBuffer) { // если был создан callbackBuffer поместить внего API. временный callbackBuffer создается при вызове колбека.
      this._callbackBuffer.push(method.bind(this, options));

      return this._callbackBuffer;
    }
    if (this._inMovingProgress) { // если карусель находится в движении(асинхронный процесс), поместить API в буфер
      this._buffer.push(method.bind(this, options));

      return this._buffer;
    }
    method.call(this, options); // вызвать API не помещая в буфер

    return true;
  }


  _goToPosition({ position, isAnimated, callback }) {
    const step = position - this._curentSlideIndex;
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


  /*
  *
  *   Drag & drop, onClick event
  *
  */


  _onMouseDown(event) {
    if (!event.target.closest('[data-slide-v-elem="moving-elem"]')) { // если клик вне moving-elem
      return;
    }
    this._containerElem.addEventListener('click', this._onClick);

    if (this._inMovingProgress) {
      return;
    }
    this._startDragPos = parseFloat(this._movingElem.style.left);
    this._clickСoordinate = event.clientX;
    this._containerElem.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseout', this._onMouseOut);
  }

  _onMouseMove(event) { // движение при перетаскивании
    this._dragShift = this._clickСoordinate - event.clientX;

    const availableStep = this._getAvailableStep(this._dragShift); // доступное количество слайдов для перемещения
    this._curentStep = (this._config.step < availableStep) // текущее количество перемещаемых слайдов на данном шаге
      ? this._config.step
      : availableStep;

    this._movingElem.style.transitionDuration = '';

    if (this._numberSlidesAfterFrame === 0 && this._dragShift > 0) { // конечное положение сдвиг слайдов влево
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.05)}px`;
      return;
    }
    if (this._curentSlideIndex === 0 && this._dragShift < 0) { // начальне положение сдвиг слайдов вправо
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.05)}px`;
      return;
    }
    this._movingElem.style.left = `${this._startDragPos - (this._dragShift / (this._config.slidesInFrame / this._curentStep))}px`;
  }

  _onClick(event) {
    if (!this._dragShift || Math.abs(this._dragShift) < 3) { // определение клика по слайду
      this._config.onSlideClick(event.target.closest('.slide-v_slide'));
    }

    if (this._dragShift > 0 || this._dragShift < 0) {
      this._dropMoving();
    }
    this._containerElem.removeEventListener('mousemove', this._onMouseMove);
    this._containerElem.removeEventListener('click', this._onClick);
    document.removeEventListener('mouseout', this._onMouseOut);
  }

  _onMouseOut(event) {
    if (!event.relatedTarget.contains(this._containerElem)) { // сработает только на containerElem или за его пределами
      return;
    }
    if (this._dragShift > 0 || this._dragShift < 0) {
      this._dropMoving();
    }
    this._containerElem.removeEventListener('mousemove', this._onMouseMove);
    this._containerElem.removeEventListener('click', this._onClick);
    document.removeEventListener('mouseout', this._onMouseOut);
  }

  _dropMoving() { // движение при бросании
    this._dropMethod = this._getDropMethod();
    if (this._dropMethod === this.next || this._dropMethod === this.prev) {
      this._dropMethod();
      // ускорение премещения в зависимости от положения при перетаскивании (при перемещении на 50%, скорость увеличится вдвое)
      const progressDragCoefficient = this._getProgressDragCoefficient();
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration + (this._config.transitionDuration * progressDragCoefficient)}ms`;
    }
    if (this._dropMethod === this._moveToStartDragPos) {
      this._dropMethod();
    }
    this._dragShift = 0;
  }

  _getDropMethod() { // получение метода при бросании
    const { curentSlideIndex } = this.getState();

    if (this._dragShift > 100 && this._numberSlidesAfterFrame !== 0) {
      return this.next;
    }
    if (this._dragShift < -100 && curentSlideIndex !== 0) {
      return this.prev;
    }
    return this._moveToStartDragPos;
  }

  _getProgressDragCoefficient() { // коефицеинт премещения при перетаскивании (0 -> 1)
    const startPosition = this._startDragPos;
    const endPosition = -(this._curentSlideIndex * this._lastSlideWidth);
    const range = endPosition - startPosition;
    const progress = (this._dragShift / (this._config.slidesInFrame / Math.abs(this._curentStep)));
    return progress / range;
  }

  _moveToStartDragPos() { // отмена drag & drop
    this._inMovingProgress = true;
    this._movingElem.style.transitionDuration = '50ms';
    this._movingElem.style.left = `${this._startDragPos}px`;
    this._preventOnMoveEnd = true; // необходимо для onTransitionEnd если нужна анимация без события onMoveEnd, единоразово запрещает событие onMoveEnd
  }


  /*
  *
  *   Resize
  *
  */


  _onResize() {
    if (this._inMovingProgress) {
      this._dynamicAdaptationStructure();
    } else {
      this._movingElem.style.transitionDuration = '';
      const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
      this._movingElem.style.left = `${-this._curentSlideIndex * slideWidth}px`;
    }
  }

  _dynamicAdaptationStructure() { // изменение ширины слайдов и положения movingElem в процессе перемежения
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const endPositionLeft = -(this._curentSlideIndex * slideWidth); // позиция в которую перемещается movingElem
    const slideWidthCoefficient = slideWidth / this._lastSlideWidth; // насколько изменилась ширина слайда по сравнению с последним событием onResize
    const startPositionLeft = endPositionLeft + (this._curentStep * slideWidth); // позиция с которой перемещается movingElem
    let curentPositionLeft = parseFloat(getComputedStyle(this._movingElem).left); // текущая позиция movingElem
    curentPositionLeft *= slideWidthCoefficient; // требуемая текущая позиция movingElem c с учетом изменения ширины слайда

    this._movingElem.style.left = `${curentPositionLeft}px`; // изменение текущего положения movingElem с учетом изменения ширины слайда
    this._movingElem.style.transitionDuration = ''; // перемещение в новое положение curentPositionLeft должно быть без анимации

    // текущий коэфициент прогресса перемещения от startPositionLeft до endPositionLeft
    const progressMovingCoefficient = (endPositionLeft - curentPositionLeft) / (endPositionLeft - startPositionLeft);
    this._lastSlideWidth = slideWidth;
    clearTimeout(this._timerResize); // выполнить только последний setTimeout

    this._timerResize = setTimeout(() => { // после корректировки положения movingElem, запускаем анимацию с новым значением transitionDuration
      // изменение скорости премещения movingElem в соответствии с коэфициент прогресса перемещения
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration * progressMovingCoefficient}ms`;
      this._movingElem.style.left = `${endPositionLeft}px`;
    }, 50);
  }


  /*
  *
  *   Events
  *
  */


  _eventSubscribe() {
    window.addEventListener('resize', this._onResize);
    this._movingElem.addEventListener('transitionend', this._onTransitionEnd);
    this._containerElem.addEventListener('mousedown', this._onMouseDown);
    this._containerElem.addEventListener('dragstart', this._onDragStart);
    this._movingElem.addEventListener('dragstart', this._onDragStart);
    for (let i = 0; i < this._movingElem.children.length; i += 1) {
      this._movingElem.children[i].addEventListener('dragstart', this._onDragStart);
    }
  }


  _eventUnsubscribe() {
    window.removeEventListener('resize', this._onResize);
    this._movingElem.removeEventListener('transitionend', this._onTransitionEnd);
    this._containerElem.removeEventListener('mousedown', this._onMouseDown);
    this._containerElem.removeEventListener('dragstart', this._onDragStart);
    this._movingElem.removeEventListener('dragstart', this._onDragStart);
    for (let i = 0; i < this._movingElem.children.length; i += 1) {
      this._movingElem.children[i].removeEventListener('dragstart', this._onDragStart);
    }
  }


  /*
  *
  *     API
  *
  */


  getState() {
    return {
      curentSlideIndex: this._curentSlideIndex,
      numberSlidesAfterFrame: this._numberSlidesAfterFrame,
      lastSlideIndex: (this._curentSlideIndex + this._config.slidesInFrame + this._numberSlidesAfterFrame) - 1, // заменить на количество элементов в movingElem
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
