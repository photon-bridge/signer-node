const FORMATTED_CHAR_LENGTH = 4;

// Add extra 0 to the left of the char code if it's length is less than FORMATTED_CHAR_LENGTH
function formatChar(_char) {
  let char = _char;

  while (char.length < FORMATTED_CHAR_LENGTH)
    char = '0' + char;

  return char;
};

// Take the mod of the char code with 10^FORMATTED_CHAR_LENGTH. This is an extra check in case there are some ASCII codes with more than FORMATTED_CHAR_LENGTH digits
function formatCharCode(charCode) {
  return (charCode % Math.pow(10, FORMATTED_CHAR_LENGTH + 1)).toString();
};

module.exports = str => {
  if (!str || typeof str != 'string' || !str.trim().length)
    return null;

  let resultString = '';

  str.trim().split('').forEach(char => {
    resultString += formatChar(formatCharCode(char.charCodeAt(0)));
  });

  return BigInt(resultString);
}