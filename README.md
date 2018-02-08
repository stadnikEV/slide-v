slider-v is under development<br/>

1. npm install<br/>
2. start for development: npm run dev       http://localhost:8080/<br/>
   start for production: npm run prod<br/>


Using:<br/>

let myCarousel = new slideV({<br/>
  containerElem: ‘.my-carousel’,<br/>
  transitionDuration: 200,<br/>
  transitionTiming: 'linear',<br/>
  elementsInFrame: 1,<br/>
  step: 1,<br/>
  startIndex: 1,<br/>
  onInit: (curentIndex, numberElemAfterFrame) => {},<br/>
  onChange: ({eventName, curentIndex, numberElemAfterFrame }) => {},<br/>

  onClick: (elem) => {}, don't work now<br/>
})


API:<br/>

next()<br/>
prev()<br/>
adjust(Steps)<br/>
destory(InitialMarkup = true/false)<br/>
init()<br/>
getState()<br/>
goTo(index)<br/>
prepend(item)<br/>
append(item)<br/>
insert(item, index)<br/>
remove(fromIndex)
