// check if a string only contains digits from 0 to 9
const isNumber = (str) => {
  return /^[0-9]+$/.test(str);
}

// check if a string is a valid floating point number (no integers allowed)
const isStrictFloat = (str) => {
  return /^-?\d+\.\d+$/.test(str);
}

// remove a specific character from a string
const removeChar = (str, char=' ') => {
  newStr = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== char) newStr += str[i];
  }

  return newStr;
}

// replace space with any other character or string
const replaceSpace = (str, replacer) => {
  let newStr = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      newStr += replacer;
    } else {
      newStr += str[i];
    }
  }

  return newStr;
}

// replace long back-to-back spaces with a single space
const cutLongSpaces = (str) => {
  let newStr = '', flag = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      if (!flag) {
        newStr += ' ';
        flag = true;
      }
    } else {
      newStr += str[i];
      flag = false;
    }
  }

  return newStr;
}

// check if a given variable in a DOM element
const isDOMElement = (element) => {
  if (element instanceof HTMLElement) {
    return [true, element];
  } else if (element instanceof jQuery && element[0] instanceof HTMLElement) {
    return [true, element[0]];
  }

  return [false];
}

// check if an array includes all the variables in the elements array
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

// check if an array includes an element
const includes = (element, array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) return true;
  }

  return false;
}

// map a number from one range to another
const map = (n, sl, sh, rl, rh) => {
  return rl + ((n - sl) / (sh - sl)) * (rh - rl);
}

// redirect user to the given url
const goToURL = (url) => {
  window.location.href = url;
}

// open a new tab with the given url
const newTab = (url) => {
  window.open(url, '_blank');
}

// test
const test = (test) => {
  console.log(test);
}

// change the :root css variable value to the value provided
const setCSSRootVariable = (variableName, value) => {
  document.documentElement.style.setProperty(`--${variableName}`, value);
}

// configure the width and height of a canvas by a multiplier
const canvasDimConfigure = (canvasID, widthMultiplier=1, heightMultiplier=1) => {
  let canvas = $('#'+canvasID)[0];
  canvas.width = canvas.getClientRects()[0].width * widthMultiplier;
  canvas.height = canvas.getClientRects()[0].height * heightMultiplier;
}
