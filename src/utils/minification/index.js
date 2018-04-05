
module.exports = function minification(source) {
  let input = source;
  // начальные значения юникод символов для замены
  const unicodeArr = [97, 96];
  // объект с найдннными совпадениями
  const matches = {};
  // наяальная позиция для поиска совпадений
  let pos = 0;
  // подстрока для поиска
  let target = 'this._';


  /*
  *   определяет конечную заменяемую позицию
  */


  const getEndReplacePos = ({ startReplacePos, startComparePos }) => {
    let endReplacePos = startReplacePos + startComparePos;
    for (;;) {
      // прерываем если символ не английская буква верхнего или нижнего регистра
      if (input.charCodeAt(endReplacePos) > 122 || input.charCodeAt(endReplacePos) < 65) break;
      if (input.charCodeAt(endReplacePos) > 90 && input.charCodeAt(endReplacePos) < 97) break;
      endReplacePos += 1;
    }
    // console.log(startReplacePos, endReplacePos);
    return endReplacePos;
  };


  /*
  *   получает следующую последовательность символов для замены
  */

  const getNextReplacedSymbol = () => {
    unicodeArr[1] += 1;
    if (unicodeArr[1] === 123) {
      unicodeArr[0] += 1;
      unicodeArr[1] = 97;
    }
    return `${String.fromCharCode(unicodeArr[0])}${String.fromCharCode(unicodeArr[1])}`;
  };


  /*
  *   находит совпадения this._x и делаем замену. Результаты записывает в объект "matches"
  */


  for (;;) {
    // позиция с которой начинаем замену
    const startReplacePos = input.indexOf(target, pos);
    if (startReplacePos === -1) break;

    // позиция до которой делаем замену
    // для определения endReplacePos используется startComparePos. Исключает ложные нахождения символов "._" после "this"
    const endReplacePos = getEndReplacePos({ startReplacePos, startComparePos: 6 });

    // найденное совпадение которое нужно будет заменить
    const foundSubstring = input.slice(startReplacePos, endReplacePos);
    // последовательность символов на которую будем замнять
    let replacedSymbol;

    // если такая подстрока была найдена ранее
    if (matches[foundSubstring]) {
      replacedSymbol = matches[foundSubstring];
    }
    // если такая подстрока не была найдена ранее
    if (!matches[foundSubstring]) {
      replacedSymbol = getNextReplacedSymbol();
      matches[foundSubstring] = replacedSymbol;
    }
    // подстрока до позиции замены
    const substringBefore = input.slice(0, startReplacePos);
    // подстрока после позиции замены
    const SubstringAfter = input.slice(endReplacePos);
    // создание новой строки с замененным совпадением
    input = `${substringBefore}this.${replacedSymbol}${SubstringAfter}`;
    // продолжаем поиск совпадений со следующей позийии (this.xx)
    pos = startReplacePos + 7;
  }


  /*
  *   находим совпадения для методов на основе найденных совпадений this._x
  */


  Object.keys(matches).forEach((prop) => {
    // наяальная позиция для поиска совпадений
    pos = 0;
    // подстрока для поиска
    target = prop.slice(5);

    for (;;) {
      // позиция с которой начинаем замену
      const startReplacePos = input.indexOf(target, pos);
      if (startReplacePos === -1) break;
      // количество символов которые нужно заменить
      const targetLength = target.length;
      // позиция до которой делаем замену
      // для определения endReplacePos используется startComparePos. Исключает ложное нахождение символа "_"
      const endReplacePos = getEndReplacePos({ startReplacePos, startComparePos: 1 });

      // проверка соответствует target полной найденной подстроке. Пример: '_init' !== '_initApi'
      if (targetLength !== endReplacePos - startReplacePos) break;

      // подстрока до позиции замены
      const substringBefore = input.slice(0, startReplacePos);
      // подстрока после позиции замены
      const SubstringAfter = input.slice(startReplacePos + targetLength);
      // последовательность символов на которую будем замнять
      const replacedSymbol = matches[prop];
      // создание новой строки с замененным совпадением
      input = `${substringBefore}${replacedSymbol}${SubstringAfter}`;
      // продолжаем поиск совпадений со следующей позийии
      pos = startReplacePos + targetLength;
    }
  });

  return input;
};
