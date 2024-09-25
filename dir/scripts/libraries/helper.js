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
