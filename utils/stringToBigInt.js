module.exports = str => {
  if (!str || typeof str != 'string' || !str.trim().length)
    return null;

  let result = 0n;

  str.trim().split('').forEach(char => {
    result += BigInt(char.charCodeAt(0));
  });

  return result;
}