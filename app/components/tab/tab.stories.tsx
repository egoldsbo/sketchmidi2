import React from 'react';

import { color, boolean } from '@storybook/addon-knobs';

import Tab from './tab';

export default {
  component: Tab,
  title: 'Atoms/Tab',
};

export const example = () => {
  return <Tab>Select example</Tab>;
};

export const knobs = () => {
  let useColor = boolean('useColor', true);
  let highlight = boolean('hightlight Tab', true);
  let active = boolean('Active', false);
  let theColor = color('Color', 'rgba(0,196,168,1)');
  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);
  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  return (
    <Tab
      color={useColor && `#${r}${g}${b}`}
      active={active}
      isActive={true}
      highlight={highlight}>
      Select example
    </Tab>
  );
};
