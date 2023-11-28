const generateMatrix = (width, height, fill = 0) => {
  return new Array(width).fill(0).map(() => {
    return new Array(height).fill(fill);
  });
};

export default generateMatrix;
