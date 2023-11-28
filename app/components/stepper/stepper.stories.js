import React, { useState } from 'react';

import { number, color, boolean } from '@storybook/addon-knobs';

import Stepper from './stepper';

export default {
  component: Stepper,
  title: 'Atoms/Stepper',
};

export const knobs = () => {
  let useColor = boolean('useColor', true);
  let knobColor = color('Color', 'rgba(0,196,168,1)');

  let match = knobColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  let [value, setValue] = useState(0);

  return (
    <Stepper
      color={useColor && `#${r}${g}${b}`}
      vertical={boolean('vertical', false)}
      step={number('step', 1)}
      min={number('min', -5)}
      max={number('max', 15)}
      value={value}
      countUp={setValue}
      countDown={setValue}
    />
  );
};
