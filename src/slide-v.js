
export default class SlideV {
  constructor(config) {
    if (!SlideV.checkContainerStructure({ config, containerSelector: config.containerSelector })) {
      return;
    }
    this.config = SlideV.setDefaultPropertyConfig(config);
    this.mainContainer = document.querySelector(this.config.containerSelector);
    this.numberSlidesAfterFrame = this.mainContainer.children.length - this.config.elementsInFrame;
    this.init();
  }


  static checkContainerStructure({ config, containerSelector }) {
    if (!('containerSelector' in config)) {
      console.warn('Side-v error: "config.containerSelector" is not defined. It is required parametr');

      return false;
    }

    if (typeof containerSelector !== 'string') {
      console.warn('Side-v error: "config.containerSelector" - uncorrect type of data. Use "String" type');

      return false;
    }

    const containerElem = document.querySelector(containerSelector);

    if (containerElem === null
      || containerElem === undefined
      || containerElem.nodeType !== 1) {
      console.warn('Side-v error: "containerElem" - it is not DOM Element');

      return false;
    }

    if (containerElem.children.length === 0) {
      console.warn('Side-v error: "containerElem" does not contain elements');

      return false;
    }

    return true;
  }


  static setDefaultPropertyConfig(config) {
    const newConfig = config;
    newConfig.transitionDuration = config.transitionDuration || 300;
    newConfig.transitionTiming = config.transitionTiming || 'linear';
    newConfig.elementsInFrame = config.elementsInFrame || 1;
    newConfig.step = config.step || 1;
    newConfig.startIndex = config.startIndex || 0;

    return newConfig;
  }


  init() {
    if (this.initState) {
      return;
    }
    this.bufer = [];

    if (!this.movingContainer) {
      this.position = 0;
      this.createDomStructure();

      if (this.config.startIndex !== 0) {
        this.adjustPosition(this.config.startIndex);
        this.firstRun = true; //  not run onChange during initialization
      }
    }
    this.initState = true;

    if (this.config.onInit) {
      this.config.onInit({
        curentIndex: this.position,
        numberElemAfterFrame: this.numberSlidesAfterFrame,
      });
    }
  }


  createDomStructure() {
    this.mainContainer.style.overflow = 'hidden';
    this.mainContainer.style.position = 'relative';

    this.movingContainer = document.createElement('div');
    this.movingContainer.style.whiteSpace = 'nowrap';
    this.movingContainer.style.boxSizing = 'border-box';
    this.movingContainer.style.position = 'relative';
    this.movingContainer.style.left = '0';
    this.movingContainer.style.transition = `left ${this.config.transitionTiming} ${this.config.transitionDuration}ms`;

    const elemInContainer = this.mainContainer.children.length;

    for (let i = 0; i < elemInContainer; i += 1) {
      const slide = this.mainContainer.firstElementChild;
      this.setCssProperty(slide);
      this.movingContainer.appendChild(slide);
    }
    this.mainContainer.prepend(this.movingContainer);
    return this.mainContainer;
  }


  destory(initialMarkup) {
    if (!this.initState) return;
    this.buferEnqueue(this.deactivation.bind(this, initialMarkup));
    if (!this.inProgress) this.buferDequeue()();
  }


  deactivation(initialMarkup) {
    this.initState = false;
    this.bufer = null;

    if (initialMarkup) {
      this.destoryDomStructure();
    }

    this.onChange('destory');
  }


  destoryDomStructure() {
    const elemInMovingContainer = this.movingContainer.children.length;
    for (let i = 0; i < elemInMovingContainer; i += 1) {
      const slide = this.movingContainer.firstElementChild;
      slide.style.width = '';
      slide.style.display = '';
      this.mainContainer.appendChild(slide);
    }
    this.mainContainer.style.overflow = '';
    this.mainContainer.style.position = '';
    this.mainContainer.removeChild(this.movingContainer);
    this.movingContainer = null;
    this.config.startIndex = this.position;

    return this.mainContainer;
  }


  adjust(stepValue) {
    if (!this.initState) return;
    this.buferEnqueue(this.adjustPosition.bind(this, stepValue));
    if (!this.inProgress) this.buferDequeue()();
  }


  adjustPosition(stepValue) {
    const availableStep = this.getAvailableStep(stepValue);

    if (!SlideV.checkStepLength(stepValue, availableStep)) {
      if (this.bufer.length > 0) this.buferDequeue()();

      return false;
    }

    this.movingContainer.style.transitionDuration = '';

    setTimeout(() => {
      this.inProgress = false;
      this.movingContainer.style.transitionDuration = `${this.config.transitionDuration}ms`;

      if (this.config.onChange && !this.firstRun) { //  not run onChange during initialization
        this.firstRun = false;
        this.onChange('adjust');
      }

      if (this.bufer.length > 0) this.buferDequeue()();
    }, 0);

    return this.makeStep(stepValue);
  }


  next() {
    if (!this.initState) return;
    this.buferEnqueue(this.finityStep.bind(this, this.config.step, 'next'));
    if (!this.inProgress) this.buferDequeue()();
  }


  prev() {
    if (!this.initState) return;
    this.buferEnqueue(this.finityStep.bind(this, -this.config.step, 'prev'));
    if (!this.inProgress) this.buferDequeue()();
  }


  finityStep(stepValue, eventName) {
    const availableStep = this.getAvailableStep(stepValue);
    const step = (Math.abs(stepValue) < availableStep)
      ? stepValue
      : availableStep * Math.sign(stepValue);

    if (step === 0) {
      this.inProgress = false;
      if (this.bufer.length > 0) this.buferDequeue()();

      return step;
    }

    return this.makeStep(step, eventName);
  }


  makeStep(step, eventName) {
    this.inProgress = true;
    this.position += step;
    this.numberSlidesAfterFrame += -step;
    const slideWidth = this.movingContainer.firstElementChild.offsetWidth;
    this.movingContainer.style.left = `${-this.position * slideWidth}px`;

    const onTransitionend = () => {
      this.inProgress = false;
      this.movingContainer.removeEventListener('transitionend', onTransitionend);

      if (this.config.onChange) {
        this.onChange(eventName);
      }

      if (this.bufer.length > 0) this.buferDequeue()();
    };

    if (this.movingContainer.style.transitionDuration === '') {
      return step;
    }

    this.movingContainer.addEventListener('transitionend', onTransitionend);

    return step;
  }


  goTo(position) {
    if (!this.initState) return;
    this.buferEnqueue(this.goToPosition.bind(this, position));
    if (!this.inProgress) this.buferDequeue()();
  }


  goToPosition(position) {
    const stepValue = position - this.position;
    const availableStep = this.getAvailableStep(stepValue);

    if (!SlideV.checkStepLength(stepValue, availableStep) || stepValue === 0) {
      if (this.bufer.length > 0) this.buferDequeue()();

      return false;
    }

    return this.makeStep(position - this.position, 'goTo');
  }


  prepend(elem) {
    if (!this.initState) return;
    this.buferEnqueue(this.insertPrepend.bind(this, elem));
    if (!this.inProgress) this.buferDequeue()();
  }


  insertPrepend(elem) {
    const newElement = elem;
    this.numberSlidesAfterFrame += 1;
    this.setCssProperty(newElement);
    this.movingContainer.prepend(newElement);
    if (this.config.onChange) {
      this.onChange('prepend');
    }
    if (this.bufer.length > 0) this.buferDequeue()();

    return newElement;
  }


  append(elem) {
    if (!this.initState) return;
    this.buferEnqueue(this.insertAppend.bind(this, elem));
    if (!this.inProgress) this.buferDequeue()();
  }


  insertAppend(elem) {
    const newElement = elem;
    this.numberSlidesAfterFrame += 1;
    this.setCssProperty(newElement);
    this.movingContainer.append(newElement);
    if (this.config.onChange) {
      this.onChange('append');
    }
    if (this.bufer.length > 0) this.buferDequeue()();

    return newElement;
  }


  insert(elem, index) {
    if (!this.initState) return;
    this.buferEnqueue(this.insertBeforeElem.bind(this, elem, index));
    if (!this.inProgress) this.buferDequeue()();
  }


  insertBeforeElem(elem, index) {
    const newElement = elem;

    if (index < 0
      || index > this.movingContainer.children.length - 1) {
      console.warn('slide-V error: the index exceeds the available value');

      if (this.bufer.length > 0) this.buferDequeue()();

      return false;
    }

    this.numberSlidesAfterFrame += 1;
    this.setCssProperty(newElement);
    this.movingContainer.children[index].before(newElement);

    if (this.config.onChange) {
      this.onChange('insert');
    }

    if (this.bufer.length > 0) this.buferDequeue()();

    return newElement;
  }


  remove(index) {
    if (!this.initState) return;
    this.buferEnqueue(this.removeElem.bind(this, index));
    if (!this.inProgress) this.buferDequeue()();
  }

  removeElem(index) {
    if (index < 0
      || index > this.movingContainer.children.length - 1) {
      console.warn('slide-V error: the index exceeds the available value');

      if (this.bufer.length > 0) this.buferDequeue()();

      return false;
    }

    this.numberSlidesAfterFrame -= 1;
    const elem = this.movingContainer.removeChild(this.movingContainer.children[index]);
    SlideV.removeCssProperty(elem);

    if (this.config.onChange) {
      this.onChange('remove');
    }

    if (this.bufer.length > 0) this.buferDequeue()();

    return elem;
  }


  buferEnqueue(method) {
    this.bufer.push(method);

    return method;
  }


  buferDequeue() {
    const func = this.bufer[0];
    this.bufer.shift();

    return func;
  }


  setCssProperty(elem) {
    const slide = elem;
    slide.style.width = `${100 / this.config.elementsInFrame}%`;
    slide.style.display = 'inline-block';
    return slide;
  }

  static removeCssProperty(elem) {
    const slide = elem;
    slide.style.width = '';
    slide.style.display = '';
    return slide;
  }


  static checkStepLength(stepValue, availableSteps) {
    if (Math.abs(stepValue) > availableSteps) {
      console.warn('slide-V error: the step exceeds the available value');
      return false;
    }
    return true;
  }


  getAvailableStep(stepValue) {
    return (Math.sign(stepValue) === 1)
      ? this.numberSlidesAfterFrame
      : this.position;
  }


  getState() {
    return {
      curentSlideIndex: this.position,
      numberSlidesAfterFrame: this.numberSlidesAfterFrame,
    };
  }


  onChange(eventName) {
    this.config.onChange({
      eventName,
      curentIndex: this.position,
      numberElemAfterFrame: this.numberSlidesAfterFrame,
    });
  }
}
