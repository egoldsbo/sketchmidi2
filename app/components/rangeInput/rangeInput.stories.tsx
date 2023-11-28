import React, { useState } from 'react';

import { color, boolean, text } from '@storybook/addon-knobs';

import RangeInput from './rangeInput';

export default {
  component: RangeInput,
  title: 'Atoms/RangeInput',
};

export const knobs = () => {
  let [value, setValue] = useState('');
  let theInverse = boolean('inverse', true);
  let useColor = boolean('useColor', true);
  let theColor = color('Color', 'rgba(0,196,168,1)');

  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  return (
    <RangeInput
      color={useColor && `#${r}${g}${b}`}
      inverse={theInverse}
      value={value}
      onChange={setValue}
      pattern={text('pattern', '[0-9a-zA-Z]*')}
    />
  );
};
