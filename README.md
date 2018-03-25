
# Slide-V - classic carousel

Slide-V provides basic functionality to easy using and opportunity adding new features through API. In the carousel implemented [buffer](https://codepen.io/StadnikEV/pen/ZxQdXZ) to call API. Not used frameworks, dependencies and external styles.


# Installing


**Place script to HTML**

    <script src="slide-v.min.js"></script>

global variable:

    SlideV



**Use module system**

	import SlideV from 'slide-v';

   or

    const SlideV = require('slide-v');

# Using

Slide-V  use your DOM structure:

	<div class="container">
	    <div> slide 0 </div>
	    <div> slide 1 </div>
	    <div> slide 2 </div>
	</div>

  init:

	<script>
	    new SlideV({
	      containerSelector: '.container'
	    })
	</script>

# Configuration

	new SlideV({
	    containerSelector: '.container',
	    slidesInFrame: 1,
	    step: slidesInFrame,
	    transitionDuration: 300,
	    draggable: true,
	    dragThreshold: 0.2,
	    slideElemClass: 'class-name',
	    movingElemClass: 'class-name',
	    onMoveEnd: () => {},
	    onSlideClick: (slideElem) => {},
	})
| property | data<br>(default)| description |
|--|:--:|--|
|**containerSelector**|**DOM element,**<br>or<br>**string**<br><br>*( '.slide-v' )*|Slide-v creating additional "movingElem" inside the<br>"container" and placing child elements of "container"<br>inside to "movingElem".<br><br>DOM element: [example](https://codepen.io/StadnikEV/pen/VXLNRo), String: [example](https://codepen.io/StadnikEV/pen/pLjMyj)
|**slidesInFrame**| **number**<br>*(1)* |Number of slides displayed in frame of "container".<br>[example](https://codepen.io/StadnikEV/pen/PRqMzM)  
|**step**|**number**<br>*(slidesInFrame)*| Number of moving slides per one step. [example](https://codepen.io/StadnikEV/pen/mxebrE)
|**transitionDuration**|**number**<br>*(300)*|Time at milliseconds during which carousel moving.<br>"TransitionDuration" it is "css" property. [example](https://codepen.io/StadnikEV/pen/yKYBXq)
|**draggable**|**boolean**<br>*(true)*|Enable or disable "Drag'n'Drop" [example](https://) <br>**(in the development)**
|**dragThreshold**|**number**<br>*(0.2)*|The shift value at which the step is activated.<br>Available values from 0 to 1. [example](https://) <br>**(in the development)**
|**slideElemClass**|**string**|Adding class to slide elements on the initialization stage.<br> This class will be add to slide elements which was added<br> to carousel through API.  [example](https://codepen.io/StadnikEV/pen/QmjLmr)
|**movingElemClass**|**string**|Adding class to "movingElem" which was created inside<br>"container". [example](https://codepen.io/StadnikEV/pen/wmKwEy)
|**onMoveEnd**|**function**|Event handler of ending moving. [example](https://codepen.io/StadnikEV/pen/pLjoeM)
|**onSlideClick**|**function**|Event handler of mouse click on slide element.<br>This slide element passing to parameters of function.<br> [example](https://codepen.io/StadnikEV/pen/qoOBMP)


<br>

# API
<br>  

## next

    next ( { step: number, isAnimated = boolean, callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| step | number | slidesInFrame |
|isAnimated|boolean|true|
|callback|function|-|

**next()**  
Moving slides one step to left. If carousel moved to the end position then carousel will not moving on at this direction. [example](https://codepen.io/StadnikEV/pen/rdOVLq)

**next({ step: number })**  
Moving slides one step to left  with specified "step". [example](https://codepen.io/StadnikEV/pen/rdOOde)

**next({ isAnimated: boolean })**  
On/off animation of moving. If animation is off then event "onMoveEnd" do not fired. [example](https://codepen.io/StadnikEV/pen/jzbbpN)

**next({ callback: function })**  
"Callback" function called asynchronously at the end of animation after event "onMoveEnd".  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "next" method. [example](https://codepen.io/StadnikEV/pen/PRPPxX)

## prev

    prev ( { step: number, isAnimated: boolean, callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| step | number | slidesInFrame |
|isAnimated|boolean|true|
|callback|function|-|

**prev()**  
Moving slides one step to right. If carousel moved to the end position then carousel will not moving on at this direction. [example](https://codepen.io/StadnikEV/pen/rdOVLq)

**prev({ step: number })**  
Moving slides one step to right with specified "step". [example](https://codepen.io/StadnikEV/pen/rdOOde)

**prev({ isAnimated: boolean })**  
On/off animation of moving. If animation is off then event "onMoveEnd" do not fired. [example](https://codepen.io/StadnikEV/pen/jzbbpN)

**prev({ callback: function })**  
"Callback" function called asynchronously at the end of animation after event "onMoveEnd".  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "prev" method. [example](https://codepen.io/StadnikEV/pen/PRPPxX)

## goTo

    goTo ( index: number, { isAnimated: boolean, callback: function }  )
| parameter | data | default |
|:--|:--:|:--:|
| index | number | 0 |
|isAnimated|boolean|true|
|callback|function|-|

**goTo()**  
Moving carousel to position at a zero index. [example](https://codepen.io/StadnikEV/pen/MVabwV)

**goTo(index)**  
Moving carousel to position with specified "index". if "index" more/less of available value then carousel moving to end/start position. [example](https://codepen.io/StadnikEV/pen/wmGLdq)

**goTo({ isAnimated })**  
On/off animation of moving. If animation is off then event "onMoveEnd" do not fired. [example](https://codepen.io/StadnikEV/pen/JLYbMP)

**goTo({ callback })**  
"Callback" function called asynchronously at the end of animation after event "onMoveEnd".  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "goTo" method. [example](https://codepen.io/StadnikEV/pen/rdOWQg)


## getState


    getState()

Returns object with current position of the carousel. [example](https://codepen.io/StadnikEV/pen/qoOqeZ)

    Object {
      curentSlideIndex: number,
      lastSlideIndex: number,
      numberSlidesAfterFrame: number
    }


## prepend

    prepend( newElem, { callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| newElem | DOM element |-|
|callback|function|-|

**prepend(newElem)**  
Adding new element to beginning of carousel. This parameter is required. [example](https://codepen.io/StadnikEV/pen/MVKwMZ)

**prepend(newElem, { callback: function })**  
"Callback" function called in sync at the end of "prepend" method. [example](https://codepen.io/StadnikEV/pen/YawQEV)


## append

    append( newElem, { callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| newElem | DOM element |-|
|callback|function|-|


**append(newElem)**  
Adding new element to end of carousel. This parameter is required. [example](https://codepen.io/StadnikEV/pen/NYxvqV)

**append(newElem, { callback: function })**  
"Callback" function called in sync at the end of "append" method. [example](https://codepen.io/StadnikEV/pen/rdxzNe)


## insert

    insert( newElem, index, { callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| newElem | DOM element | - |
| index | number |-|
| callback | function | - |

**insert(newElem, index)**  
Adding new element before the element with specified "index". If element with specified "index" is not exist then new element will not add. Both parameter is required. [example](https://codepen.io/StadnikEV/pen/bvErRX)

**insert(newElem, index, { callback: function })**  
"Callback" function called in sync at the end of "insert" method. [example](https://codepen.io/StadnikEV/pen/NYxvyP)


## remove

    remove( index, { callback: function } )

| parameter | data | default |
|:--|:--:|:--:|
| index | number |-|
| callback | function | - |

**remove(index)**  
Removing element with specified "index". This parameter is required. [example](https://codepen.io/StadnikEV/pen/KoVJoy)

**remove(index, { callback: function })**  
"Callback" function called in sync at the end of "remove" method. [example](https://codepen.io/StadnikEV/pen/zWreEJ)


## destroy

    destroy( { initialMarkup: boolean, callback: function } )
| parameter | data | default |
|:--|:--:|:--:|
| initialMarkup | boolean |false|
| callback | function | - |

**destroy()**  
Removing all event listeners. After called "destroy" all methods of API will be not available. [example](https://codepen.io/StadnikEV/pen/MVKROe)

**destroy({ initialMarkup })**  
Removing all event listeners and return "DOM structure" to initial state. [example](https://codepen.io/StadnikEV/pen/rdxgGv)

**destroy({ callback })**  
"Callback" function called in sync at the end of "destroy" method. [example](https://codepen.io/StadnikEV/pen/XEXwbV)
<br><br>

# Features

**Buffer**

 - All API placed to buffer will be call in order of queue. [example](https://codepen.io/StadnikEV/pen/ZxQdXZ)

 - API which was passed with "callback" function will be call in order relative to each other. [example](https://codepen.io/StadnikEV/pen/jzWjQd)

**Dynamic adaptive structure**

Follow the [link](https://codepen.io/StadnikEV/pen/bvEXVz) and change window width of browser.
