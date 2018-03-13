
export default function setDefaultPropertyOfConfig(config) {
  config.containerSelector = (typeof config.containerSelector === 'string')
    ? document.querySelector(config.containerSelector)
    : config.containerSelector;
  config.transitionDuration = config.transitionDuration || 300;
  config.slidesInFrame = config.slidesInFrame || 1;
  config.step = config.step || config.slidesInFrame;
  config.onMoveEnd = config.onMoveEnd || (() => {});
  config.onSlideClick = config.onSlideClick || (() => {});

  return config;
}
