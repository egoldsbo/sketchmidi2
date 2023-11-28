import React, { useState } from 'react';

import { color, boolean, number } from '@storybook/addon-knobs';

import generateMatrix from '../utils/generateMatrix';
import StepSequencer from './stepSequencer';

export default {
  component: StepSequencer,
  title: 'Molecules/StepSequencer',
};

export const example = () => {
  const [matrix, setMatrix] = useState([
    [4, 4, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 1, 0, 0, 1, 0],
    [2, 2, 0, 2, 0, 0, 1, 0],
    [2, 2, 0, 3, 0, 0, 1, 0],
    [2, 2, 0, 4, 0, 0, 1, 0],
    [2, 2, 0, 5, 0, 0, 1, 0],
    [3, 2, 0, 0, 0, 0, 1, 0],
    [1, 5, 0, 0, 0, 0, 1, 0],
    [4, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [2, 2, 0, 0, 0, 0, 1, 0],
    [3, 3, 0, 0, 0, 0, 1, 0],
  ]);
  const [highlighted] = useState(0);

  const updateCell = (x, y) => () => {
    setMatrix((matrix) => {
      const newMatrix = matrix.map((col, i) => {
        if (i === x) {
          return col.map((cell, j) => {
            if (j === y) {
              return cell ^ 1;
            }

            return cell;
          });
        }

        return col;
      });

      return newMatrix;
    });
  };

  return (
    <>
      <StepSequencer
        matrix={matrix}
        highlighted={highlighted}
        updateCell={updateCell}
        subDivisions={1}
      />
      <StepSequencer
        preview
        matrix={matrix}
        highlighted={highlighted}
        updateCell={updateCell}
        subDivisions={1}
      />
    </>
  );
};

export const knobs = () => {
  const rows = number('rows', 8);
  const colums = number('columns', 16);
  const [matrix, setMatrix] = useState(generateMatrix(colums, rows));
  let highlighted = number('highlightedColumn', 0);
  let theColor = color('Color', 'rgba(0,196,168,1)');
  const isPlaying = boolean('isPlaying', false);
  let subDivisions = number('SubDivisions', 1);

  let match = theColor.match(/^rgba\((\d+),(\d+),(\d+),(\d+)\)$/);

  let r = parseInt(match[1]).toString(16).padStart(2, '0');
  let g = parseInt(match[2]).toString(16).padStart(2, '0');
  let b = parseInt(match[3]).toString(16).padStart(2, '0');

  const updateCell = (x, y) => () => {
    setMatrix((matrix) => {
      const newMatrix = matrix.map((col, i) => {
        if (i === x) {
          return col.map((cell, j) => {
            if (j === y) {
              return cell ^ 1;
            }

            return cell;
          });
        }

        return col;
      });

      return newMatrix;
    });
  };

  return (
    <div>
      <StepSequencer
        matrix={matrix}
        highlighted={highlighted}
        color={`#${r}${g}${b}`}
        updateCell={updateCell}
        isPlaying={isPlaying}
        subDivisions={subDivisions}
      />
      <StepSequencer
        matrix={matrix}
        highlighted={highlighted}
        color={`#${r}${g}${b}`}
        updateCell={updateCell}
        isPlaying={isPlaying}
        subDivisions={subDivisions}
        preview
      />
    </div>
  );
};
