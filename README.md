

# Slide-V - classic carousel

Slide-V provides basic functionality to easy using and opportunity adding new features through API. In the carousel implemented [API buffer](https://codepen.io/StadnikEV/pen/ZxQdXZ), drag & drop, [adaptive structure](https://codepen.io/StadnikEV/pen/bvEXVz). Not used frameworks, dependencies and external styles.


 - [**Installing**](#installing)
 - [**Using**](#using)
 - [**Configuration**](#configuration)
 - [**API**](#api)
 - [**Features**](#features)


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
| property | type<br>(default)| description |
|--|:--:|--|
|**containerSelector**|**DOM element,**<br>or<br>**string**<br><br>*( '.slide-v' )*|Slide-v creating additional "movingElem" inside<br>the "container" and placing child elements of<br> "container" inside to "movingElem".<br><br>Default: [example](https://codepen.io/StadnikEV/pen/gevjep)<br>DOM element: [example](https://codepen.io/StadnikEV/pen/VXLNRo)<br>String: [example](https://codepen.io/StadnikEV/pen/pLjMyj)
|**slidesInFrame**| **number**<br>*(1)* |Number of slides displayed in frame of "container".<br>[example](https://codepen.io/StadnikEV/pen/PRqMzM)  
|**step**|**number**<br>*(slidesInFrame)*| Number of moving slides per one step. [example](https://codepen.io/StadnikEV/pen/mxebrE)
|**transitionDuration**|**number**<br>*(300)*|Time at milliseconds during which carousel moving.<br>"TransitionDuration" it is "css" property. [example](https://codepen.io/StadnikEV/pen/yKYBXq)
|**draggable**|**boolean**<br>*(true)*|Enable or disable "Drag'n'Drop". [example](https://codepen.io/StadnikEV/pen/pLWaML)
|**dragThreshold**|**number**<br>*(0.2)*|The shift value at which the step is activated.<br>Available values from 0 to 1. [example](https://codepen.io/StadnikEV/pen/Kooybm)
|**slideElemClass**|**string**|Adding class to slide elements on the initialization<br>stage. This class will be add to slide elements which<br> was added to carousel through API.  [example](https://codepen.io/StadnikEV/pen/QmjLmr)
|**movingElemClass**|**string**|Adding class to "movingElem" which was created<br> inside "container". [example](https://codepen.io/StadnikEV/pen/wmKwEy)
|**onMoveEnd**|**function**|Event handler of ending moving. [example](https://codepen.io/StadnikEV/pen/pLjoeM)
|**onSlideClick**|**function**|Event handler of mouse click on slide element.<br>This slide element passing to parameters of function.<br> [example](https://codepen.io/StadnikEV/pen/qoOBMP)


<br>

# API

 - [**next**](#next)
 - [**prev**](#prev)
 - [**goTo**](#goto)
 - [**getState**](#getstate)
 - [**prepend**](#prepend)
 - [**append**](#append)
 - [**insert**](#insert)
 - [**remove**](#remove)
 - [**destroy**](#destroy)

## next

    next ( { step: number, isAnimated = boolean, callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| step | number | slidesInFrame |no
|isAnimated|boolean|true|no
|callback|function|-|no

**next()**  
Moving slides one step to left. If carousel moved to the end position then carousel will not moving on at this direction. [example](https://codepen.io/StadnikEV/pen/rdOVLq)

**next({ step: number })**  
Moving slides one step to left  with specified "step". [example](https://codepen.io/StadnikEV/pen/rdOOde)

**next({ isAnimated: boolean })**  
On/off animation of moving. If animation is off then event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM) do not fired. [example](https://codepen.io/StadnikEV/pen/jzbbpN)

**next({ callback: function })**  
"Callback" function called asynchronously at the end of animation after event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM).  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "next" method. [example](https://codepen.io/StadnikEV/pen/PRPPxX)

## prev

    prev ( { step: number, isAnimated: boolean, callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| step | number | slidesInFrame |no
|isAnimated|boolean|true|no
|callback|function|-|no

**prev()**  
Moving slides one step to right. If carousel moved to the end position then carousel will not moving on at this direction. [example](https://codepen.io/StadnikEV/pen/rdOVLq)

**prev({ step: number })**  
Moving slides one step to right with specified "step". [example](https://codepen.io/StadnikEV/pen/rdOOde)

**prev({ isAnimated: boolean })**  
On/off animation of moving. If animation is off then event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM) do not fired. [example](https://codepen.io/StadnikEV/pen/jzbbpN)

**prev({ callback: function })**  
"Callback" function called asynchronously at the end of animation after event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM).  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "prev" method. [example](https://codepen.io/StadnikEV/pen/PRPPxX)

## goTo

    goTo ( index: number, { isAnimated: boolean, callback: function }  )
| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| index | number | 0 |no
|isAnimated|boolean|true|no
|callback|function|-|no

**goTo(index)**  
Moving carousel to position with specified "index". if "index" more/less of available value then carousel moving to end/start position. [example](https://codepen.io/StadnikEV/pen/wmGLdq)

**goTo({ isAnimated })**  
On/off animation of moving. If animation is off then event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM) do not fired. [example](https://codepen.io/StadnikEV/pen/JLYbMP)

**goTo({ callback })**  
"Callback" function called asynchronously at the end of animation after event ["onMoveEnd"](https://codepen.io/StadnikEV/pen/pLjoeM).  If "isAnimated = false" or carousel at the end position then "callback" function will be call in sync at the end of "goTo" method. [example](https://codepen.io/StadnikEV/pen/rdOWQg)


## getState


    getState()

Returns object with current position of the carousel. [example](https://codepen.io/StadnikEV/pen/qoOqeZ)

    Object {
      curentSlideIndex: number,
      lastSlideIndex: number,
      numberSlidesAfterFrame: number
    }

**NOTICE:** "getState" does not returns "slide-v" object. Do not use "getState" for chaining:

    new SlideV().getState().next()


## prepend

    prepend( newElem, { callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| newElem | DOM element |-|yes
|callback|function|-|no

**prepend(newElem)**  
Adding new element to beginning of carousel. This parameter is required. [example](https://codepen.io/StadnikEV/pen/MVKwMZ)

**prepend(newElem, { callback: function })**  
"Callback" function called in sync at the end of "prepend" method. [example](https://codepen.io/StadnikEV/pen/YawQEV)


## append

    append( newElem, { callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| newElem | DOM element |-|yes
|callback|function|-|no


**append(newElem)**  
Adding new element to end of carousel. This parameter is required. [example](https://codepen.io/StadnikEV/pen/NYxvqV)

**append(newElem, { callback: function })**  
"Callback" function called in sync at the end of "append" method. [example](https://codepen.io/StadnikEV/pen/rdxzNe)


## insert

    insert( newElem, index, { callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| newElem | DOM element | - |yes
| index | number |-|yes
| callback | function | - |no

**insert(newElem, index)**  
Adding new element before the element with specified "index". If element with specified "index" is not exist then new element will not add. Both parameter is required. [example](https://codepen.io/StadnikEV/pen/bvErRX)

**insert(newElem, index, { callback: function })**  
"Callback" function called in sync at the end of "insert" method. [example](https://codepen.io/StadnikEV/pen/NYxvyP)


## remove

    remove( index, { callback: function } )

| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| index | number |-| yes
| callback | function | - |no

**remove(index)**  
Removing element with specified "index". This parameter is required. [example](https://codepen.io/StadnikEV/pen/KoVJoy)

**remove(index, { callback: function })**  
"Callback" function called in sync at the end of "remove" method. [example](https://codepen.io/StadnikEV/pen/zWreEJ)


## destroy

    destroy( { initialMarkup: boolean, callback: function } )
| parameter | type | default |required parameter
|:--|:--:|:--:|:--:|
| initialMarkup | boolean |false|no
| callback | function | - |no

**destroy()**  
Removing all event listeners. After called "destroy" all methods of API (exception [getState](#getstate)) will be not available. [example](https://codepen.io/StadnikEV/pen/MVKROe)

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
