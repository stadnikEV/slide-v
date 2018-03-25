
export default function setDefaultPropertyOfConfig(config) {
  config.containerSelector = (typeof config.containerSelector === 'string')
    ? document.querySelector(config.containerSelector)
    : config.containerSelector;
  config.transitionDuration = config.transitionDuration || 300;
  config.slidesInFrame = config.slidesInFrame || 1;
  config.step = config.step || config.slidesInFrame;
  config.onMoveEnd = config.onMoveEnd || (() => {});
  config.onSlideClick = config.onSlideClick || (() => {});

  if (config.draggable === false) {
    return config;
  }
  config.draggable = true;
  config.dragThreshold = (config.dragThreshold === 0)
    ? 0.01
    : config.dragThreshold || 0.2;

  return config;
}
