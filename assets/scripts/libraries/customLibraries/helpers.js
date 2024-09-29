// to check if a string only contains digits from 0 to 9
const isNumber = (str) => {
  return /^[0-9]+$/.test(str);
}

// to check if a string is a valid floating point number (no integers allowed)
const isStrictFloat = (str) => {
  return /^-?\d+\.\d+$/.test(str);
}

// removes a specific character from a string
const removeChar = (str, char=' ') => {
  newStr = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== char) newStr += str[i];
  }

  return newStr;
}

// configure the width and height of a canvas by a multiplier
const canvasDimConfigure = (canvasID, widthMultiplier=1, heightMultiplier=1) => {
  let canvas = $('#'+canvasID)[0];
  canvas.width = canvas.getClientRects()[0].width * widthMultiplier;
  canvas.height = canvas.getClientRects()[0].height * heightMultiplier;
}

// replace space with any other character or string
const replaceSpace = (str, replacer) => {
  let new_str = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      new_str += replacer;
    } else {
      new_str += str[i];
    }
  }

  return new_str;
}

// replaces long back-to-back spaces with a single space
const cutLongSpaces = (str) => {
  let new_str = '', flag = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      if (!flag) {
        new_str += ' ';
        flag = true;
      }
    } else {
      new_str += str[i];
      flag = false;
    }
  }

  return new_str;
}

// checks if a given variable in a DOM element
const isDOMElement = (element) => {
  if (element instanceof HTMLElement) {
    return [true, element];
  } else if (element instanceof jQuery && element[0] instanceof HTMLElement) {
    return [true, element[0]];
  }

  return [false];
}

// checks if an array includes all the variables in the elements array
const includesAll = (elements, array) => {
  if (array) {
    for (let i = 0; i < elements.length; i++) {
      let found = false;
      for (let j = 0; j < array.length; j++) {
        if (elements[i] === array[j]) {
          found = true;
        }
      }
      if (!found) return false;
    }
  } else return false;

  return true;
}

// checks if an array includes an element
const includes = (element, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) return true;
  }

  return false;
}

// redirects user to the given url
const goToURL = (url) => {
  window.location.href = url;
}