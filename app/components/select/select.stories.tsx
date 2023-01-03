import React, { useState } from 'react';

import { color, boolean } from '@storybook/addon-knobs';

import Select from './select';

export default {
  component: Select,
  title: 'Atoms/Select',
};

const options = [
  { value: 'Option One', label: 'Option One' },
  { value: 'Option Two', label: 'Option Two' },
  { value: 'Option Three', label: 'Option Three' },
  { value: 'Option Four', label: 'Option Four' },
];
export const example = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Select
      isActive={isActive}
      setIsActive={setIsActive}
      options={options}></Select>
  );
};

export const knobs = () => {
  let theInverse = boolean('inverse', true);
  let useColor = boolean('useColor', true);
  let theColor = color('Color', 'rgba(0,196,168,1)');
  const [isActive, setIsActive] = useState(false);

  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  return (
    <Select
      color={useColor && `#${r}${g}${b}`}
      inverse={theInverse}
      isActive={isActive}
      setIsActive={setIsActive}
      options={options}
    />
  );
};
