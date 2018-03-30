import isCorrectContainerStructure from './utils/is-correct-container-structure';
import setDefaultPropertyOfConfig from './utils/set-default-property-of-config';
import matchesPolyfill from './utils/matches-polyfill';
import closestPolyfill from './utils/closest-polyfill';
import mathSignPolyfill from './utils/math-sign-polyfil';


export default class SlideV {
  constructor(configuration) {
    let config = configuration;
    // если нет конфиг объекта, создать его
    if (!config) config = {};

    if (!isCorrectContainerStructure(config)) return;
    this._config = setDefaultPropertyOfConfig(config);

    // полифилы

    mathSignPolyfill();
    matchesPolyfill(Element.prototype);
    closestPolyfill(Element.prototype);

    // оборачиваем обработчики событий и сохраняем в пременные

    [
      '_onTransitionEnd',
      '_onResize',
      '_onTouchStart',
      '_onTouchMove',
      '_onTouchEnd',
      '_onMouseDown',
      '_onMouseMove',
      '_onMouseLeave',
      '_onMouseUp',
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
    this._position = 0;
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
    if (this._config.draggable) {
      // это хак, но он работает))
      this._movingElem.style.cursor = '-webkit-grab';
      this._movingElem.style.cursor = '-moz-grab';
      this._movingElem.style.cursor = 'grab';
    }
    // поместить дочерние элементы из containerElem в movingElem
    for (let i = 0; i < this._numberOfSlides; i += 1) {
      const slideElem = this._containerElem.firstElementChild;
      this._setCssSlideElem(slideElem);
      this._movingElem.appendChild(slideElem);
    }
    // задать ширину элементам
    this._setWidths();
    // удаляет текстовые узлы
    this._containerElem.innerHTML = '';
    this._containerElem.appendChild(this._movingElem);
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
  *     API
  *
  */


  getState() {
    return {
      curentSlideIndex: this._position,
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
    const step = position - this._position;
    return this._takeStep({ step, isAnimated, callback });
  }


  _takeStep({ step, isAnimated = true, callback }) {
    this._inMovingProgress = true;

    if (this._config.draggable && this._config.transitionDuration > 700) {
      this._movingElem.style.cursor = '';
      this._movingElem.style.cursor = '';
      this._movingElem.style.cursor = '';
    }
    // Проверить был ли посчитан this._curentStep в другом методе
    this._curentStep = this._getСurentStep(step);

    if (this._curentStep === 0) {
      this._inMovingProgress = false;
      this._callbackHandler({ callback });
      this._callApiFromBuffer();
      return;
    }

    this._movingElem.style.left = `${this._getNextPositionLeft()}px`;

    this._position += this._curentStep;
    this._numberSlidesAfterFrame += -this._curentStep;

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
  }

  _getСurentStep(step) {
    // доступное количество слайдов для перемещения
    const availableStep = (Math.sign(step) === 1)
      ? this._numberSlidesAfterFrame
      : this._position;
    return (Math.abs(step) < availableStep)
      ? step
      : availableStep * Math.sign(step);
  }

  _getNextPositionLeft() {
    // clientWidth и offsetWidth не точно измеряют. Накапливается ошибка.
    const curentSlideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    // необходимо для onResize
    this._lastSlideWidth = curentSlideWidth;
    return -(this._position + this._curentStep) * curentSlideWidth;
  }


  // Обработчик события окончания css анимации
  _onTransitionEnd() {
    this._inMovingProgress = false;
    if (this._config.draggable && this._config.transitionDuration > 700) {
      this._movingElem.style.cursor = '-webkit-grab';
      this._movingElem.style.cursor = '-moz-grab';
      this._movingElem.style.cursor = 'grab';
    }
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
    this._movingElem.insertBefore(slideElem, this._movingElem.firstElementChild);
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
    this._movingElem.appendChild(slideElem);
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
      this._callbackHandler({ callback });
      this._callApiFromBuffer();
      return;
    }
    const lastNumberSlidesInMovingElem = this._numberOfSlides;
    this._movingElem.insertBefore(slideElem, this._movingElem.children[index]);
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
      this._callbackHandler({ callback });
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
  *   Events
  *
  */


  _eventSubscribe() {
    window.addEventListener('resize', this._onResize);
    this._movingElem.addEventListener('transitionend', this._onTransitionEnd);
    this._containerElem.addEventListener('dragstart', this._onDragStart);
    this._movingElem.addEventListener('mousedown', this._onMouseDown);
    this._movingElem.addEventListener('touchstart', this._onTouchStart);

    if (!this._config.draggable) return;

    this._movingElem.addEventListener('touchmove', this._onTouchMove);
    this._movingElem.addEventListener('touchend', this._onTouchEnd);
    document.addEventListener('mousemove', this._onMouseMove);
    this._movingElem.addEventListener('mouseleave', this._onMouseLeave);
    document.addEventListener('mouseup', this._onMouseUp);
  }


  _eventUnsubscribe() {
    window.removeEventListener('resize', this._onResize);
    this._movingElem.removeEventListener('transitionend', this._onTransitionEnd);
    this._containerElem.removeEventListener('dragstart', this._onDragStart);
    this._movingElem.removeEventListener('mousedown', this._onMouseDown);
    this._movingElem.removeEventListener('touchstart', this._onTouchStart);

    if (!this._config.draggable) return;

    this._movingElem.removeEventListener('touchmove', this._onTouchMove);
    this._movingElem.removeEventListener('touchend', this._onTouchEnd);
    document.removeEventListener('mousemove', this._onMouseMove);
    this._movingElem.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('mouseup', this._onMouseUp);
  }


  /*
  *
  *   Drag & drop, onClick event
  *
  */


  _onMouseDown(event) {
    if (this._inMovingProgress || event.which !== 1) return;
    this._isMouseDown = true;
    this._clickX = event.clientX;
    this._startDragPos = parseFloat(this._movingElem.style.left);
    if (this._config.draggable) {
      this._movingElem.style.cursor = '-webkit-grabbing';
      this._movingElem.style.cursor = '-moz-grabbing';
      this._movingElem.style.cursor = 'grabbing';
    }
  }

  _onTouchStart(event) {
    // отменяет mousedown(через 300мс) для события touchstart
    event.preventDefault(); // проверить не применится ли это при всплытии!!!!!!!!!!
    if (this._inMovingProgress) return;
    this._isTouchDown = true;
    this._touchX = event.changedTouches[0].pageX;
    this._startDragPos = parseFloat(this._movingElem.style.left);
  }

  _onMouseMove(event) {
    if (!this._isMouseDown) return;
    this._dragShift = this._clickX - event.clientX;
    this._dragMove();
  }

  _onTouchMove(event) {
    if (!this._isTouchDown) return;
    this._dragShift = this._touchX - event.changedTouches[0].pageX;
    this._dragMove();
  }

  // алгоритм перемещения movingElem при перетаскивании
  _dragMove() {
    this._inMovingProgress = true;

    const dragdDirection = Math.sign(this._dragShift);

    // не пересчитывать this._curentStep и this._nextPositionLeft для каждого события
    if (this._dragdDirection !== dragdDirection) {
      this._dragdDirection = dragdDirection;
      this._curentStep = this._getСurentStep(dragdDirection * this._config.step);
      this._nextPositionLeft = this._getNextPositionLeft();
    }

    this._movingElem.style.transitionDuration = '';

    // перемещение для начального положения
    if (this._position === 0 && dragdDirection === -1) {
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.1)}px`;
      return;
    }
    // перемещение для конечного положения
    if (this._numberSlidesAfterFrame === 0 && dragdDirection === 1) {
      this._movingElem.style.left = `${this._startDragPos - (this._dragShift * 0.1)}px`;
      return;
    }
    // перемещение между начальным и конечным положениями
    const dragShiftCoefficient = Math.abs(this._curentStep / this._config.slidesInFrame);
    this._movingElem.style.left = `${this._startDragPos - (this._dragShift * dragShiftCoefficient)}px`;

    // ограничение перемещения если слайд находится в ожидаемом положении
    if (parseFloat(this._movingElem.style.left) < this._nextPositionLeft && dragdDirection === 1) {
      // что бы сработал onTransitionEnd, не доводим до конца на 0.1px
      this._movingElem.style.left = `${this._nextPositionLeft + (dragdDirection * 0.1)}px`;
    }
    if (parseFloat(this._movingElem.style.left) > this._nextPositionLeft && dragdDirection === -1) {
      // что бы сработал onTransitionEnd, не доводим до конца на 0.1px
      this._movingElem.style.left = `${this._nextPositionLeft + (dragdDirection * 0.1)}px`;
    }
  }

  _onMouseLeave(event) {
    if (!this._isMouseDown) return;
    this._isMouseDown = false;
    if (this._config.draggable) {
      this._movingElem.style.cursor = '-webkit-grab';
      this._movingElem.style.cursor = '-moz-grab';
      this._movingElem.style.cursor = 'grab';
    }
    this._dragEnd(event.target);
  }

  _onTouchEnd(event) {
    if (!this._isTouchDown) return;
    this._isTouchDown = false;
    this._dragEnd(event.target);
  }

  _onMouseUp(event) {
    if (!this._isMouseDown) return;
    this._isMouseDown = false;
    if (this._config.draggable) {
      this._movingElem.style.cursor = '-webkit-grab';
      this._movingElem.style.cursor = '-moz-grab';
      this._movingElem.style.cursor = 'grab';
    }
    this._dragEnd(event.target);
  }

  // определение клика и перетаскивания. Запуск соответствующих метолов
  _dragEnd(clickedElem) {
    this._dragdDirection = null;
    this._inMovingProgress = false;
    // если небыло сдвига или сдвиг меньше 3px - то это клик
    if (!this._dragShift || Math.abs(this._dragShift) < 3) {
      const elem = clickedElem.closest('[data-slide-v-elem="slide-elem"]');
      if (elem) this._config.onSlideClick(elem);
    }
    // если был сдвиг
    if (this._dragShift > 0 || this._dragShift < 0) {
      this._dropMoving();
    }
  }


  // движение при бросании
  _dropMoving() {
    const curentPositionLeft = parseFloat(this._movingElem.style.left);
    // получить метод движения для завершения drag&drop
    const dropMethod = this._getDropMethod();
    dropMethod.call(this);
    this._dragShift = 0;

    // ускорение премещения при перетаскивании в зависимости от положения movingElem
    if (dropMethod === this.next || dropMethod === this.prev) {
      const progressDragCoefficient = this._getProgressDragCoefficient(curentPositionLeft);
      this._movingElem.style.transitionDuration = `${this._config.transitionDuration - (this._config.transitionDuration * progressDragCoefficient)}ms`;
    }
  }


  // получение метода для бросания
  _getDropMethod() {
    const containerWidth = this._containerElem.clientWidth;
    // -2 нужно что бы работал коефициент dragThreshold = 1
    const Threshold = (containerWidth * this._config.dragThreshold) - 2;

    if (this._dragShift > Threshold && this._numberSlidesAfterFrame !== 0) {
      return this.next;
    }
    if (this._dragShift < -Threshold && this._position !== 0) {
      return this.prev;
    }
    return this._cancelDrag;
  }


  // коефицеинт премещения при перетаскивании (0 -> 1)
  _getProgressDragCoefficient(curentPositionLeft) {
    const endPositionLeft = this._nextPositionLeft;
    const startPositionLeft = endPositionLeft + (this._curentStep * this._lastSlideWidth);
    return (curentPositionLeft - startPositionLeft) / (endPositionLeft - startPositionLeft);
  }


  // отмена drag & drop
  _cancelDrag() {
    this._inMovingProgress = true;
    this._movingElem.style.transitionDuration = '100ms';
    this._movingElem.style.left = `${this._startDragPos}px`;
    // для анимации отмены drag&drop обработчик onTransitionEnd не должен вызываться
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
    this._movingElem.style.left = `${-this._position * slideWidth}px`;
  }


  // изменение ширины слайдов и положения movingElem в процессе перемещения
  _dynamicAdaptationStructure() {
    const slideWidth = parseFloat(getComputedStyle(this._movingElem.firstElementChild).width);
    // позиция в которую перемещается movingElem
    const endPositionLeft = -(this._position * slideWidth);
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
