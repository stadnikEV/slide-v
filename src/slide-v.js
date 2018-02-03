
export default class SlideV {
  constructor(config) {
    if (!SlideV.checkContainerStructure({ config, containerSelector: config.containerSelector })) {
      return;
    }
    this.config = SlideV.setDefaultPropertyConfig(config);
    this.createDomStructure();
  }
  createDomStructure() {
    this.containerElem = document.querySelector(this.config.containerSelector);
    this.containerElem.style.overflow = 'hidden';

    this.frameElem = document.createElement('div');
    this.frameElem.style.whiteSpace = 'nowrap';

    const elemInContainer = this.containerElem.children.length;

    for (let i = 0; i < elemInContainer; i += 1) {
      const slideElem = this.containerElem.firstElementChild;
      slideElem.style.width = `${100 / this.config.elementsInFrame}%`;
      slideElem.style.display = 'inline-block';
      this.frameElem.appendChild(slideElem);
    }
    this.containerElem.prepend(this.frameElem);
  }
  destoryDomStructure() {
    const elemInFrame = this.frameElem.children.length;
    for (let i = 0; i < elemInFrame; i += 1) {
      const slideElem = this.frameElem.firstElementChild;
      slideElem.style.width = '';
      slideElem.style.display = '';
      this.containerElem.appendChild(slideElem);
    }
    this.containerElem.style.overflow = '';
    this.containerElem.removeChild(this.frameElem);
  }
  static checkContainerStructure({ config, containerSelector }) {
    if ('containerSelector' in config) {
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
    console.warn('Side-v error: "config.containerSelector" is not defined. It is required parametr');
    return false;
  }
  static setDefaultPropertyConfig(config) {
    const newConfig = config;
    newConfig.transitionDuration = config.transitionDuration || 300;
    newConfig.transitionTiming = config.transitionTiming || 'linear';
    newConfig.elementsInFrame = config.elementsInFrame || 1;
    newConfig.step = config.step || 1;
    newConfig.startIndex = config.startIndex || 1;
    return newConfig;
  }
}
