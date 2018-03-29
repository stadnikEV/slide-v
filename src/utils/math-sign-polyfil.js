export default function mathSignPolyfill() {
  Math.sign = Math.sign || function(x) {
    x = +x; // преобразуем в число
    if (x === 0 || isNaN(x)) {
      return x;
    }
    return x > 0 ? 1 : -1;
  }
};
