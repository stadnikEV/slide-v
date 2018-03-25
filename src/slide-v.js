import isCorrectContainerStructure from './utils/is-correct-container-structure';
import setDefaultPropertyOfConfig from './utils/set-default-property-of-config';


export default class SlideV {
  constructor(config) {
    if (!isCorrectContainerStructure(config)) return;
    this._config = setDefaultPropertyOfConfig(config);

    // оборачиваем обработчики событий и сохраняем в пременные
    [
      '_onTransitionEnd',
      '_onMouseDown',
      '_onMouseMove',
      '_onMouseLeave',
      '_onMouseUp',
      '_onResize',
      '_onCancelDragTransitionEnd',
    ].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });

    this._onDragStart = event => event.preventDefault();

    this._init();
  }


  /*
  *
  *   initialization
  *
  */


  _init() {
    this._containerElem = this._config.containerSelector;
    // запрещает вызов любых API после вызова destoty({ initialMarkup })
    this._isInit = true;
    // буфер в который помещаются API в ожидании своей очереди
    this._buffer = [];
    this._curentSlideIndex = 0;
    this._numberOfSlides = this._containerElem.children.length;
    this._numberSlidesAfterFrame = this._numberOfSlides - this._config.slidesInFrame;
    this._createDomStructure();
    this._eventSubscribe();
  }


  _createDomStructure() {
    this._containerElem.style.overflow = 'hidden';
    this._containerElem.style.position = 'relative';

    // элемент который перемещается внутри containerElem
    this._movingElem = document.createElement('div');
    this._movingElem.style.position = 'relative';
    this._movingElem.style.left = '0';
    this._movingElem.style.transitionProperty = 'left';
    // добавить класс
    if (this._config.movingElemClass) {
      this._movingElem.classList.add(this._config.movingElemClass);
    }
    // поместить дочерние элементы из containerElem в movingElem
    for (let i = 0; i < this._numberOfSlides; i += 1) {
      const slideElem = this._containerElem.firstElementChild;
      this._setCssSlideElem(slideElem);
      this._movingElem.append(slideElem);
    }
    // задать ширину элементам
    this._setWidths();
    this._containerElem.prepend(this._movingElem);
  }


  _setCssSlideElem(slideElem) {
    slideElem.style.display = 'inline-block';
    slideElem.setAttribute('data-slide-v-elem', 'slide-elem');
    // добавить класс
    if (this._config.slideElemClass) {
      slideElem.classList.add(this._config.slideElemClass);
    }
  }


  _setWidths() {
    this._movingElem.style.width = `${(100 / this._config.slidesInFrame) * this._numberOfSlides}%`;
    const slideWidth = (100 / this._numberOfSlides);
    for (let i = 0; i < this._numberOfSlides; i += 1) {
      this._movingElem.children[i].style.width = `${slideWidth}%`;
    }
  }


  /*
  *
  *   Events
  *
  */


  _eventSubscribe() {
    window.addEventListener('resize', this._onResize);
    this._movingElem.addEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.addEventListener('mousedown', this._onMouseDown);
    this._containerElem.addEventListener('dragstart', this._onDragStart);
  }


  _eventUnsubscribe() {
    window.removeEventListener('resize', this._onResize);
    this._movingElem.removeEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.removeEventListener('mousedown', this._onMouseDown);
    this._containerElem.removeEventListener('dragstart', this._onDragStart);
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
      lastSlideIndex: this._numberOfSlides - 1,
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


  _initApi({ method, options }) {
    // запрещает использование API после destroy()
    if (!this._isInit) {
      return;
    }
    // если был создан callbackBuffer, поместить внего API. Временный callbackBuffer создается при вызове колбека.
    if (this._callbackBuffer) {
      this._callbackBuffer.push(method.bind(this, options));
      return;
    }
    // если карусель находится в движении(асинхронный процесс), поместить API в буфер
    if (this._inMovingProgress) {
      this._buffer.push(method.bind(this, options));
      return;
    }
    // вызвать API не помещая в буфер
    method.call(this, options);
  }


  /*
  *
  *   Перемещение карусели
  *
  */


  _goToPosition({ position, isAnimated, callback }) {
    const step = position - this._curentSlideIndex;
    return this._takeStep({ step, isAnimated, callback });
  }


  _takeStep({ step, isAnimated = true, callback }) {
    this._inMovingProgress = true;
    // доступное количество слайдов для перемещения
    const availableStep = this._getAvailableStep(step);
    // количество перемещаемых слайдов на данном шаге
    const curentStep = (Math.abs(step) < availableStep)
      ? step
      : availableStep * Math.sign(step);

    if (curentStep === 0) {
      this._inMovingProgress = false;
      this._callbackHandler({ callback });
      this._callApiFromBuffer();
      return;
    }

    this._curentSlideIndex += curentStep;
    this._numberSlidesAfterFrame += -curentStep;
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const positionLeft = -this._curentSlideIndex * slideWidth;
    this._movingElem.style.left = `${positionLeft}px`;

    if (!isAnimated) {
      this._inMovingProgress = false;
      this._movingElem.style.transitionDuration = '';
      this._callbackHandler({ callback });
      this._callApiFromBuffer();
      return;
    }
    this._movingElem.style.transitionDuration = `${this._config.transitionDuration}ms`;
    // сохраняет колбек в переменную для вызова в обработчике окончания css анимации onTransitionEnd
    this._callback = callback;
    // необходимо для onResize
    this._lastSlideWidth = slideWidth;
    // необходимо для onResize
    this._curentStep = curentStep;
  }


  _getAvailableStep(step) {
    return (Math.sign(step) === 1)
      ? this._numberSlidesAfterFrame
      : this._curentSlideIndex;
  }


  // Обработчик события окончания css анимации
  _onTransitionEnd() {
    console.log('_onTransitionEnd');
    this._inMovingProgress = false;
    this._config.onMoveEnd();
    this._callbackHandler({ callback: this._callback });
    this._callApiFromBuffer();
  }


  /*
  *
  *   Общие методы
  *
  */


  _callbackHandler({ callback }) {
    if (typeof callback !== 'function') {
      return;
    }
    console.log('callback');
    // вспомогательный, временный буфер. Необходим для помещения API из callback в основной буфер
    this._callbackBuffer = [];
    callback();
    // добавление API методов из callback в основной буфер
    this._buffer = this._callbackBuffer.concat(this._buffer);
    this._callbackBuffer = null;
    this._callback = null;
  }


  // вызов следующего API из буфера
  _callApiFromBuffer() {
    if (this._buffer.length > 0) {
      const method = this._buffer.shift();
      method();
    }
  }


  /*
  *
  *   Добавление, удаление слайдов
  *
  */


  _insertPrepend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._numberOfSlides;
    this._movingElem.prepend(slideElem);
    // проверить добавился ли элемент
    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) {
      this._numberSlidesAfterFrame += 1;
      this._numberOfSlides += 1;
      this._setCssSlideElem(slideElem);
      this._setWidths();
    }
    this._callbackHandler({ callback });
    this._callApiFromBuffer();
  }


  _insertAppend({ slideElem, callback }) {
    const lastNumberSlidesInMovingElem = this._numberOfSlides;
    this._movingElem.append(slideElem);
    // проверить добавился ли элемент
    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) {
      this._numberSlidesAfterFrame += 1;
      this._numberOfSlides += 1;
      this._setCssSlideElem(slideElem);
      this._setWidths();
    }
    this._callbackHandler({ callback });
    this._callApiFromBuffer();
  }


  _insertBeforeSlideElem({ slideElem, index, callback }) {
    if (index < 0 || index > this._numberOfSlides - 1) {
      console.warn('slide-V error: slideElem cannot be inserted. This index does not exists');
      this._callApiFromBuffer();
      return;
    }
    const lastNumberSlidesInMovingElem = this._numberOfSlides;
    this._movingElem.children[index].before(slideElem);
    // проверить добавился ли элемент
    if (lastNumberSlidesInMovingElem + 1 === this._movingElem.children.length) {
      this._numberSlidesAfterFrame += 1;
      this._numberOfSlides += 1;
      this._setCssSlideElem(slideElem);
      this._setWidths();
    }
    this._callbackHandler({ callback });
    this._callApiFromBuffer();
  }


  _removeSlideElem({ index, callback }) {
    if (index < 0 || index > this._numberOfSlides - 1) {
      console.warn('slide-V error: slideElem cannot be deleted. This index does not exists');
      this._callApiFromBuffer();
      return;
    }
    this._numberSlidesAfterFrame -= 1;
    this._numberOfSlides -= 1;
    const removedElem = this._movingElem.removeChild(this._movingElem.children[index]);
    this._removeCssSlideElem(removedElem);
    this._setWidths();
    this._callbackHandler({ callback });
    this._callApiFromBuffer();
  }


  /*
  *
  *   Разрушение карусели
  *
  */


  _deactivation({ initialMarkup, callback } = {}) {
    this._isInit = false;
    this._buffer = [];
    this._eventUnsubscribe();
    if (initialMarkup) this._destoryDomStructure();
    this._callbackHandler({ callback });
  }


  _destoryDomStructure() {
    for (let i = 0; i < this._numberOfSlides; i += 1) {
      const slideElem = this._movingElem.firstElementChild;
      this._removeCssSlideElem(slideElem);
      this._containerElem.appendChild(slideElem);
    }
    this._containerElem.style.overflow = '';
    this._containerElem.style.position = '';
    this._containerElem.removeChild(this._movingElem);
    this._movingElem = null;
  }


  _removeCssSlideElem(slideElem) {
    slideElem.style.display = '';
    slideElem.style.width = '';
    slideElem.removeAttribute('data-slide-v-elem');
    if (this._config.slideElemClass) {
      slideElem.classList.remove(this._config.slideElemClass);
    }
  }


  /*
  *
  *   Drag & drop, onClick event
  *
  */

  // Обработчик события нажатия кнопки мыши
  _onMouseDown(event) {
    // если не левая кнопка мыши
    if (event.which > 1 || this._inMovingProgress) {
      return;
    }
    this._startDragPos = parseFloat(this._movingElem.style.left);
    this._clickСoordinate = event.clientX;
    this._movingElem.addEventListener('mouseup', this._onMouseUp);

    if (!this._config.draggable) {
      return;
    }
    this._movingElem.addEventListener('mousemove', this._onMouseMove);
    this._movingElem.addEventListener('mouseleave', this._onMouseLeave);
  }


  // Обработчик события при перетаскивании(если нажата левая кнопка мыши)
  _onMouseMove(event) {
    this._dragShift = this._clickСoordinate - event.clientX;
    // доступное количество слайдов для перемещения
    const availableStep = this._getAvailableStep(this._dragShift);
    // текущее количество перемещаемых слайдов на данном шаге
    this._curentStep = (this._config.step < availableStep)
      ? this._config.step
      : availableStep;

    this._movingElem.style.transitionDuration = '';
    // конечное положение сдвиг слайдов влево
    if (this._numberSlidesAfterFrame === 0 && this._dragShift > 0) {
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.1)}px`;
      return;
    }
    // начальне положение сдвиг слайдов вправо
    if (this._curentSlideIndex === 0 && this._dragShift < 0) {
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.1)}px`;
      return;
    }
    this._movingElem.style.left = `${this._startDragPos - (this._dragShift / (this._config.slidesInFrame / this._curentStep))}px`;
  }


  // Обработчик события отжатия кнопки мыши
  _onMouseUp(event) {
    // если не левая кнопка мыши
    if (event.which > 1) {
      return;
    }
    // определение клика по слайду
    if (!this._dragShift || Math.abs(this._dragShift) < 3) {
      const elem = event.target.closest('[data-slide-v-elem="slide-elem"]');
      if (elem) this._config.onSlideClick(elem);
    }
    this._movingElem.removeEventListener('mouseup', this._onMouseUp);

    // запустить метод после бросания если был сдвиг
    if (this._dragShift > 0 || this._dragShift < 0) {
      this._dropMoving();
    }
    this._movingElem.removeEventListener('mousemove', this._onMouseMove);
    this._movingElem.removeEventListener('mouseleave', this._onMouseLeave);
  }


  _onMouseLeave() {
    console.log('_onMouseLeave');
    // запустить метод после бросания
    if (this._dragShift > 0 || this._dragShift < 0) {
      this._dropMoving();
    }
    this._movingElem.removeEventListener('mouseup', this._onMouseUp);
    this._movingElem.removeEventListener('mousemove', this._onMouseMove);
    this._movingElem.removeEventListener('mouseleave', this._onMouseLeave);
  }


  // движение при бросании
  _dropMoving() {
    const dropMethod = this._getDropMethod();
    dropMethod.call(this);
    // ускорение премещения в зависимости от проресса перемещения при перетаскивании
    if (dropMethod === this.next || dropMethod === this.prev) {
      const progressDragCoefficient = this._getProgressDragCoefficient();
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration - (this._config.transitionDuration * progressDragCoefficient)}ms`;
    }
    this._dragShift = 0;
  }


  // получение метода при бросании
  _getDropMethod() {
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    const Threshold = slideWidth * this._config.dragThreshold;

    if (this._dragShift > Threshold && this._numberSlidesAfterFrame !== 0) {
      return this.next;
    }
    if (this._dragShift < -Threshold && this._curentSlideIndex !== 0) {
      return this.prev;
    }
    return this._cancelDrag;
  }


  // коефицеинт премещения при перетаскивании (0 -> 1)
  _getProgressDragCoefficient() {
    const startPosition = this._startDragPos;
    const endPosition = -(this._curentSlideIndex * this._lastSlideWidth);
    const range = endPosition - startPosition;
    const progress = (this._dragShift / (this._config.slidesInFrame / Math.abs(this._curentStep)));
    return Math.abs(progress / range);
  }


  // отмена drag & drop
  _cancelDrag() {
    this._inMovingProgress = true;
    this._movingElem.style.transitionDuration = '50ms';
    this._movingElem.style.left = `${this._startDragPos}px`;

    this._movingElem.removeEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.addEventListener('transitionend', this._onCancelDragTransitionEnd);
  }


  // Обработчик события окончания css анимации для отмены drag & drop
  _onCancelDragTransitionEnd() {
    this._inMovingProgress = false;
    this._movingElem.addEventListener('transitionend', this._onTransitionEnd);
    this._movingElem.removeEventListener('transitionend', this._onCancelDragTransitionEnd);
  }


  /*
  *
  *   Resize
  *
  */


  _onResize() {
    if (this._inMovingProgress) {
      this._dynamicAdaptationStructure();
      return;
    }
    this._movingElem.style.transitionDuration = '';
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    this._movingElem.style.left = `${-this._curentSlideIndex * slideWidth}px`;
  }


  // изменение ширины слайдов и положения movingElem в процессе перемещения
  _dynamicAdaptationStructure() {
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    // позиция в которую перемещается movingElem
    const endPositionLeft = -(this._curentSlideIndex * slideWidth);
    // насколько изменилась ширина слайда по сравнению с последним событием onResize
    const slideWidthCoefficient = slideWidth / this._lastSlideWidth;
    // позиция с которой перемещается movingElem
    const startPositionLeft = endPositionLeft + (this._curentStep * slideWidth);
    // текущая позиция movingElem
    let curentPositionLeft = parseFloat(getComputedStyle(this._movingElem).left);
    // требуемая текущая позиция movingElem c с учетом изменения ширины слайда
    curentPositionLeft *= slideWidthCoefficient;

    // изменение текущего положения movingElem с учетом изменения ширины слайда
    this._movingElem.style.left = `${curentPositionLeft}px`;
    // перемещение в новое положение curentPositionLeft должно быть без анимации
    this._movingElem.style.transitionDuration = '';

    // текущий коэфициент прогресса перемещения от startPositionLeft до endPositionLeft
    const progressMovingCoefficient = (endPositionLeft - curentPositionLeft) / (endPositionLeft - startPositionLeft);
    this._lastSlideWidth = slideWidth;
    clearTimeout(this._timerResize); // выполнить только последний setTimeout

    this._timerResize = setTimeout(() => {
      // после корректировки положения movingElem, запускаем анимацию с новым значением transitionDuration и left
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration * progressMovingCoefficient}ms`;
      this._movingElem.style.left = `${endPositionLeft}px`;
    }, 50);
  }
}
