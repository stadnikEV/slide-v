
export default function setDefaultPropertyOfConfig(config) {
  config.transitionDuration = config.transitionDuration || 300;
  config.slidesInFrame = config.slidesInFrame || 1;
  config.step = config.step || config.slidesInFrame;
  config.onInit = config.onInit || (() => {});
  config.onSlideChange = config.onSlideChange || (() => {});
  config.onSlideClick = config.onSlideClick || (() => {});

  return config;
}
