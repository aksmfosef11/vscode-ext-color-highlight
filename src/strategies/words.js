const Color = require('color');
const webColors = require('color-name');

let preparedRePart = Object.keys(webColors)
  .map(color => `\\b${color}\\b`)
  .join('|');

let colorWeb = new RegExp('.?(' + preparedRePart + ')(?!-)', 'g');


/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findWords(text,customWords) {
  let match = colorWeb.exec(text);
  let result = [];

  while (match !== null) {
    const firstChar = match[0][0];
    const matchedColor = match[1];
    const start = match.index + (match[0].length - matchedColor.length);
    const end = colorWeb.lastIndex;

    if (firstChar.length && /[-\\$@#]/.test(firstChar)) {
      match = colorWeb.exec(text);
      continue;
    }

    try {
      let color = null;
      if (customWords.hasOwnProperty(matchedColor)){
        color = customWords[matchedColor];
      }else{
      color = Color(matchedColor)
        .rgb()
        .string();
      }
      result.push({
        start,
        end,
        color
      });
    } catch (e) { }
    match = colorWeb.exec(text);
  }

  return result;
}

export function addCustomWord(customWords){
  Object.keys(customWords).forEach((word)=>{
    preparedRePart = preparedRePart+'|\\b'+word+'\\b';
  });
  colorWeb = new RegExp('.?(' + preparedRePart + ')(?!-)', 'g');
}