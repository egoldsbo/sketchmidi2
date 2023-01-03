import React, { useState } from 'react';

import { color, boolean } from '@storybook/addon-knobs';

import Switch from './switch';

export default {
  component: Switch,
  title: 'Atoms/Switch',
};

export const example = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Switch
      on="on"
      off="off"
      isActive={isActive}
      setIsActive={setIsActive}></Switch>
  );
};

export const knobs = () => {
  let useColor = boolean('useColor', true);
  let isVertical = boolean('isVertical', false);
  let bothOn = boolean('bothOn', false);
  let theColor = color('Color', 'rgba(0,196,168,1)');
  const [isActive, setIsActive] = useState(false);

  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  return (
    <Switch
      color={useColor && `#${r}${g}${b}`}
      isActive={isActive}
      setIsActive={setIsActive}
      vertical={isVertical}
      bothOn={bothOn}
    />
  );
};
