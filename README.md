# Slide-V - классическая карусель
Slide-V  предоставляет базовый функционал для быстрого использования и возможность расширения функционала средствами API. В карусели реализован линейный буффер вызовов API.   Не используются фреймворки, зависимости и внешние стили.

# Установка
**Подключить скрипт к странице HTML**

    <script src"slide-v.min.js"></script>

Для инициализации используй:

	new SlideV();

**Подключить скрипт как модуль**

	import SlideV from 'slide-v';

   or

    const SlideV = require('slide-v');

# Использование

Slide-V использует вашу дом структуру:

	<div class="сontainerElem">
	    <div> slide 0 </div>
	    <div> slide 1 </div>
	    <div> slide 2 </div>
	</div>
###
	<script>
	    new SlideV({
	      containerSelector: '.сontainerElem'
	    })
	</script>

# Котфигурирование

	new SlideV({
	    containerSelector: '.сontainerElem',
	    slidesInFrame: 1,
	    step: slidesInFrame,
	    transitionDuration: 300,
	    slideElemClass: 'class-name',
	    movingElemClass: 'class-name',
	    onMoveEnd: () => {},
	    onSlideClick: (slideElem) => {},
	})
| property | data | default | description |
|--|:--:|:--:|--|
| containerSelector |DOM element [пример](https://codepen.io/StadnikEV/pen/VXLNRo)  string [пример](https://codepen.io/StadnikEV/pen/pLjMyj) | - | Это обязательное свойство конфигураци. Slide-v создает внутри "сontainerElem" дополнительный "div" элемент "movingElem" и помещает в него дочерние элементы "сontainerElem". Созданный элемент будет перемещается внутри "сontainerElem".  
| slidesInFrame | number | 1 | Количество слайдов отображаемых в окне "сontainerElem". [пример](https://codepen.io/StadnikEV/pen/PRqMzM)  
|step|number| slidesInFrame | Количество перемещаемых слайдов за один шаг. [пример](https://codepen.io/StadnikEV/pen/mxebrE)
|transitionDuration|number|300| Количество miliseconds в течении которых происходит шаг. "TransitionDuration" это "css" свойство. [пример](https://codepen.io/StadnikEV/pen/yKYBXq)
|slideElemClass|string|-|Назначает класс каждому слайд элементу на этапе инициализации. Так же этот класс назначается слайд элементам, которые добавляются средствами "API". [пример](https://codepen.io/StadnikEV/pen/QmjLmr)
|movingElemClass|string|-|Назначает класс для "movingElem" созданного внутри "сontainerElem". [Пример](https://codepen.io/StadnikEV/pen/wmKwEy)
|onMoveEnd|function|-|Событие окончания перемещения. [пример](https://codepen.io/StadnikEV/pen/pLjoeM)
|onSlideClick|function|-|Событие клика мыши по слайду. В параметр функции передаются слайд элемент по которому был совершен клик. [пример](https://codepen.io/StadnikEV/pen/qoOBMP)

# API

## next

    next ( { step: number, isAnimated = boolean, callback: function } )

| parameters | data | default |
|:--:|:--:|:--:|
| step | number | slidesInFrame |
|isAnimated|boolean|true|
|callback|function|-|

`next()`  
Перемещает слайды влево. Если карусель переместилась к последнему слайду, перемещение в этом направлении больше не происходит. [пример](https://codepen.io/StadnikEV/pen/rdOVLq)

`next({ step: number })`  
Перемещает слайды влево с шагом "step". [пример](https://codepen.io/StadnikEV/pen/rdOOde)

`next({ isAnimated: boolean })`  
Включает/отключает анимацию перемещения. При отключенной анимации событие "onMoveEnd" не срабатывает. [пример](https://codepen.io/StadnikEV/pen/jzbbpN)

`next({ callback: function })`  
"Сallback" выполнится асинхронно в конце анимации шага карусели, после события "onMoveEnd". Если "isAnimated = false" или перемещение не произошло, "callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/PRPPxX)

## prev

    prev ( { step: number, isAnimated: boolean, callback: function } )

| parameters | data | default |
|:--:|:--:|:--:|
| step | number | slidesInFrame |
|isAnimated|boolean|true|
|callback|function|-|

`prev()`  
Перемещает слайды вправо. Если карусель переместилась к нулевому слайду, перемещение в этом направлении больше не происходит. [пример](https://codepen.io/StadnikEV/pen/rdOVLq)

`prev({ step: number })`  
Перемещает слайды вправо с шагом "step". [пример](https://codepen.io/StadnikEV/pen/rdOOde)

`prev({ isAnimated: boolean })`  
Включает/отключает анимацию перемещения. При отключенной анимации событие "onMoveEnd" не срабатывает. [пример](https://codepen.io/StadnikEV/pen/jzbbpN)

`prev({ callback: function }`  
"Сallback" выполнится асинхронно в конце анимации шага карусели, после события "onMoveEnd". Если "isAnimated = false" или перемещение не произошло, "callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/PRPPxX)

## goTo

    goTo ( index: number, { isAnimated: boolean, callback: function }  )
| parameters | data | default |
|:--:|:--:|:--:|
| index | number | 0 |
|isAnimated|boolean|true|
|callback|function|-|

`goTo()`  
Перемещает карусель в позицию с индексом "0". [пример](https://codepen.io/StadnikEV/pen/MVabwV)

`goTo(index)`  
Перемещает карусель в позицию "index". Если "индекс" больше/меньше доступного значения, карусель перемещается в конечное/начальное положение. [пример](https://codepen.io/StadnikEV/pen/wmGLdq)

`goTo({ isAnimated })`  
Включает/отключает анимацию перемещения. При отключенной анимации событие "onMoveEnd" не срабатывает. [пример](https://codepen.io/StadnikEV/pen/JLYbMP)

`goTo({ callback })`  
"Сallback" выполнится асинхронно вконце анимации шага карусели, после события "onMoveEnd". Если "isAnimated = false" или перемещение не произошло, "callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/rdOWQg)


## getState


    getState()

Возвращает объект с текущим положением карусели. [пример](https://codepen.io/StadnikEV/pen/qoOqeZ)

    Object {
      curentSlideIndex: number,
      lastSlideIndex: number,
      numberSlidesAfterFrame: number
    }


## prepend

    prepend( newElem, { callback: function } )

| parameters | data | default |
|:--:|:--:|:--:|
| newElem | DOM element |-|
|callback|function|-|

`prepend(newElem)`  
Добавляет новый элемент  в начало карусели. Это параметр обязательный. [пример](https://codepen.io/StadnikEV/pen/MVKwMZ)

`prepend(newElem, { callback: finction })`  
"Callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/YawQEV)


## append

    append( newElem, { callback: function } )

| parameters | data | default |
|:--:|:--:|:--:|
| newElem | DOM element |-|
|callback|function|-|


`append(newElem)`  
Добавляет новый элемент  в конец карусели. Это параметр обязательный. [пример](https://codepen.io/StadnikEV/pen/NYxvqV)

`append(newElem, { callback: function })`  
"Callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/rdxzNe)


## insert

    insert( newElem, index, { callback: function } )

| parametr | data | default |
|:--:|:--:|:--:|
| newElem | DOM element | - |
| index | number |-|
| callback | function | - |

`insert(newElem, index)`  
Добавляет новый элемент пред элементом с заданным индесом. Если элемента с заданным индексом не существует, новый элемент не добавляется. Оба параметра обязательные. [пример](https://codepen.io/StadnikEV/pen/bvErRX)

`insert(newElem, index, { callback: function })`  
"Callback" выполнится синхронно в конце метода [пример](https://codepen.io/StadnikEV/pen/NYxvyP)


## remove

    remove( index, { callback: function } )

| parametr | data | default |
|:--:|:--:|:--:|
| index | number |-|
| callback | function | - |

`remove(index)`  
Удаляет элемент с заданным индексом. Это параметр обязательный. [пример](https://codepen.io/StadnikEV/pen/KoVJoy)

`remove(index, { callback: function })`  
"Callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/zWreEJ)


## destroy

    destroy( { initialMarkup: boolean, callback: function } )
| parametr | data | default |
|:--:|:--:|:--:|
| initialMarkup | boolean |false|
| callback | function | - |

`destroy()`  
Удаляет все подписки на события. После вызова "destroy", все методы будут недоступны. [пример](https://codepen.io/StadnikEV/pen/MVKROe)

`destroy({ initialMarkup })`  
Удаляет все подписки на события и возвращает "DOM структуру" в исходное состояние. [пример](https://codepen.io/StadnikEV/pen/rdxgGv)

`destroy({ callback })`  
"Callback" выполнится синхронно в конце метода. [пример](https://codepen.io/StadnikEV/pen/XEXwbV)

## Особенности

**Buffer**

 - Все API (асинхронные и синхронные) помещаются в буффер и выполняются в
   порядке их вызова. [пример](https://codepen.io/StadnikEV/pen/ZxQdXZ)

 - API которые переданы с функцией "callback" выполнятся в порядке их вызова относительно друг друга, не нарушая общий порядок вызова API из буффера. [пример](https://codepen.io/StadnikEV/pen/jzWjQd)

**Динамическая адаптивная стуктура**

Запусти [пример](https://codepen.io/StadnikEV/pen/bvEXVz) и изменяй ширину окна браузера.
