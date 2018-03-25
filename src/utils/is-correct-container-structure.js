
export default function isCorrectContainerStructure(config) {
  let selector = config.containerSelector;

  if (!('containerSelector' in config)) {
    selector = '.slide-v';
  }

  if (selector === null || selector === undefined) {
    console.warn('Side-v error: "selector" - uncorrect type of data. Use "String" type or DOM element');

    return false;
  }

  if (typeof selector !== 'string' && selector.nodeType !== 1) {
    console.warn('Side-v error: "selector" - uncorrect type of data. Use "String" type or DOM element');

    return false;
  }

  const containerElem = (typeof selector === 'string')
    ? document.querySelector(selector)
    : selector;

  if (containerElem === null) {
    console.warn('Side-v error: "containerElem" - it is not DOM Element');

    return false;
  }

  if (containerElem.children.length === 0) {
    console.warn('Side-v error: "containerElem" - does not contain elements');

    return false;
  }

  if (config.dragThreshold < 0 || config.dragThreshold > 1) {
    console.warn('Side-v error: "dragThreshold" - uncorrect value. The value must be from 0 to 1');

    return false;
  }


  return true;
}
