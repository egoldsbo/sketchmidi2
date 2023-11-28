import React, { useState } from 'react';

import generateMatrix from '../utils/generateMatrix';
import Preview from './preview';

export default {
  component: Preview,
  title: 'Organisms/Preview',
};

export const example = () => {
  const rows = 8;
  const colums = 16;
  const [pattern] = useState(new Array(4).fill(generateMatrix(colums, rows)));
  const [highlighted] = useState(0);

  return (
    <Preview
      color="#ff0000"
      pattern={pattern}
      highlighted={highlighted}
      patternUp={() => {}}
      patternDown={() => {}}
    />
  );
};
