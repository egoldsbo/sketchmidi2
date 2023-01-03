import React from 'react';

import { color, boolean } from '@storybook/addon-knobs';

import Button from './button';

export default {
  component: Button,
  title: 'Atoms/Button',
};

export const button = () => <Button>Example Button with color</Button>;

export const knobs = () => {
  let theInverse = boolean('inverse', true);
  let useColor = boolean('useColor', true);
  let theColor = color('Color', 'rgba(0,196,168,1)');

  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  return (
    <Button color={useColor ? `#${r}${g}${b}` : null} inverse={theInverse}>
      Example Button with color
    </Button>
  );
};
