
export default function setDefaultPropertyOfConfig(config) {
  config.transitionDuration = config.transitionDuration || 300;
  config.slidesInFrame = config.slidesInFrame || 1;
  config.step = config.step || config.slidesInFrame;
  config.onMoveEnd = config.onMoveEnd || (() => {});
  config.onSlideClick = config.onSlideClick || (() => {});

  return config;
}
