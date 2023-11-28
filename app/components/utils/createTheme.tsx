/* eslint-disable no-param-reassign, no-underscore-dangle,prefer-destructuring */

export default function createTheme(theme) {
  if (theme._spacing) {
    return theme;
  }

  const { spacing, ...builtTheme } = { ...theme };

  builtTheme._spacing = spacing;

  if (!builtTheme._spacing) {
    builtTheme._spacing = 8;
  }

  if (typeof builtTheme._spacing === 'number') {
    const value = builtTheme._spacing;
    builtTheme._spacing = (abs) => value * abs;
  }

  builtTheme.spacing = (...args) => {
    if (args.length <= 0 || args.length >= 5) {
      throw new Error('Spacing args must be between 1 and 4 values');
    }

    const top = args[0];
    let right;
    let bottom;
    let left;

    if (args.length >= 2) {
      right = args[1];
    } else {
      right = top;
    }

    if (args.length >= 3) {
      bottom = args[2];
    } else {
      bottom = top;
    }

    if (args.length >= 4) {
      left = args[3];
    } else {
      left = right;
    }

    const sizes = [top, right, bottom, left]
      .slice(0, args.length)
      .map((value) => {
        if (typeof value === 'string') {
          return value;
        }

        const space = builtTheme._spacing(value);
        if (typeof space === 'string') {
          return space;
        }

        return `${space}px`;
      })
      .join(' ');

    return sizes;
  };

  return builtTheme;
}
