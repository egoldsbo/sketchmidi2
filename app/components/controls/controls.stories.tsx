import React, { useState } from 'react';

import { color, boolean } from '@storybook/addon-knobs';

import Controls from './controls';

export default {
  component: Controls,
  title: 'Molecules/Controls',
};

export const example = () => {
  const [isPlay, setIsPlay] = useState(false);
  const [isPattern, setIsPattern] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <Controls
      isPlay={isPlay}
      setIsPlay={setIsPlay}
      isPattern={isPattern}
      setIsPattern={setIsPattern}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
};

export const knobs = () => {
  let useColor = boolean('useColor', true);
  let theColor = color('Color', 'rgba(0,196,168,1)');
  let selectInverse = boolean('SelectInverse', true);
  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  const [isPlay, setIsPlay] = useState(false);
  const [isPattern, setIsPattern] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <Controls
      isPlay={isPlay}
      setIsPlay={setIsPlay}
      isPattern={isPattern}
      setIsPattern={setIsPattern}
      color={useColor && `#${r}${g}${b}`}
      isActive={isActive}
      setIsActive={setIsActive}
      inverse={selectInverse}
      saveTracks={() => console.log('save track test')}
      loadTracks={() => console.log('load track test')}
    />
  );
};
