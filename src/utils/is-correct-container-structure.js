
export default function isCorrectContainerStructure(config) {
  if (!('containerSelector' in config)) {
    console.warn('Side-v error: "config.containerSelector" - is not defined. It is required parametr');

    return false;
  }

  if (config.containerSelector === null || config.containerSelector === undefined) {
    console.warn('Side-v error: "config.containerSelector" - uncorrect type of data. Use "String" type or DOM element');

    return false;
  }

  if (typeof config.containerSelector !== 'string' && config.containerSelector.nodeType !== 1) {
    console.warn('Side-v error: "config.containerSelector" - uncorrect type of data. Use "String" type or DOM element');

    return false;
  }

  const containerElem = (typeof config.containerSelector === 'string')
    ? document.querySelector(config.containerSelector)
    : config.containerSelector;


  if (containerElem === null) {
    console.warn('Side-v error: "containerElem" - it is not DOM Element');

    return false;
  }

  if (containerElem.children.length === 0) {
    console.warn('Side-v error: "containerElem" - does not contain elements');

    return false;
  }

  return true;
}
