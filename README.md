slider-v is under development

1. npm install
2. start for development: npm run dev       http://localhost:8080/
   start for production: npm run prod


Using:

let myCarousel = new slideV({
  containerElem: ‘.my-carousel’,
  transitionDuration: 200,
  transitionTiming: 'linear',
  elementsInFrame: 1,
  step: 1,
  startIndex: 1,
  onInit: (curentIndex, numberElemAfterFrame) => {},
  onChange: ({eventName, curentIndex, numberElemAfterFrame }) => {},

  onClick: (elem) => {}, don't work now
})


API:

next()
prev()
adjust(Steps)
destory(InitialMarkup = true/false)
init()
getState()
goTo(index)
prepend(item)
append(item)
insert(item, index)
remove(fromIndex, toIndex)
