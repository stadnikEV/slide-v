
export default function isCorrectContainerStructure(config) {
  if (!('containerSelector' in config)) {
    console.warn('Side-v error: "config.containerSelector" is not defined. It is required parametr');

    return false;
  }

  if (typeof config.containerSelector !== 'string') {
    console.warn('Side-v error: "config.containerSelector" - uncorrect type of data. Use "String" type');

    return false;
  }

  const containerElem = document.querySelector(config.containerSelector);

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
