export const splitArrayToThree = (array: any[]) => {
  const len = array.length;
  let i = 0;
  let output = [];
  if (len % 2 === 0) {
    let size = Math.floor(len / 3);
    while (i < len) {
      output.push(array.slice(i, (i += size)));
    }
  }
  return output;
};
