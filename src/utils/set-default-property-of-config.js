
export default function setDefaultPropertyOfConfig(config) {
  config.containerSelector = config.containerSelector || '.slide-v';
  config.containerSelector = (typeof config.containerSelector === 'string')
    ? document.querySelector(config.containerSelector)
    : config.containerSelector;
  config.transitionDuration = config.transitionDuration || 300;
  config.transitionTiming = config.transitionTiming || 'ease';
  config.slidesInFrame = config.slidesInFrame || 1;
  config.step = config.step || config.slidesInFrame;
  config.onMoveEnd = config.onMoveEnd || (() => {});
  config.onSlideClick = config.onSlideClick || (() => {});

  config.draggable = (config.draggable === false)
    ? false
    : config.draggable || true;

  config.dragThreshold = (config.dragThreshold === 0)
    ? 0
    : config.dragThreshold || 0.2;

  return config;
}
