
export default class Loop {
  constructor({ slideV, step }) {
    this._step = step;
    this._slideV = slideV;
  }


  next() {
    const { numberSlidesAfterFrame } = this._slideV.getState();
    if (numberSlidesAfterFrame < this._step) {
      for (let i = 0; i < this._step - numberSlidesAfterFrame; i += 1) {
        this._slideV.remove(0, {
          callback: (removedElem) => {
            this._slideV.append(removedElem);
            this._slideV.prev({ step: 1, isAnimated: false });
          },
        });
      }
    }
    this._slideV.next({ step: this._step });
  }


  prev() {
    const { curentSlideIndex } = this._slideV.getState();
    console.log(curentSlideIndex);
    if (curentSlideIndex < this._step) {
      for (let i = 0; i < this._step - curentSlideIndex; i += 1) {
        const { lastSlideIndex } = this._slideV.getState();
        this._slideV.remove(lastSlideIndex - 1, {
          callback: (removedElem) => {
            this._slideV.prepend(removedElem);
            this._slideV.next({ step: 1, isAnimated: false });
          },
        });
      }
    }
    this._slideV.prev({ step: this._step });
  }
}
