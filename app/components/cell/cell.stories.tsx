import React from 'react';

import Color from 'color';
import { useTheme } from '@emotion/react';

import { Cell, Note } from './cell';

export default {
  component: Cell,
  title: 'Atoms/Cell',
};

export const example = () => {
  const theme = useTheme();
  const color = '#FF0000';
  const colorFull = Color(color).hsl().toString();
  const color050 = Color(color).hsl().alpha(0.5).toString();

  return (
    <>
      <Cell preview={false} isPlaying={false} filled={0} color={colorFull}>
        <Note
          filled={0}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={false} isPlaying={false} filled={1} color={colorFull}>
        <Note
          filled={1}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={false} isPlaying={false} filled={2} color={colorFull}>
        <Note
          filled={2}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={false} isPlaying={false} filled={3} color={colorFull}>
        <Note
          filled={3}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={false} isPlaying={false} filled={4} color={colorFull}>
        <Note
          filled={4}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={false} isPlaying={false} filled={5} color={colorFull}>
        <Note
          filled={5}
          preview={false}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={0} color={colorFull}>
        <Note
          filled={0}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={1} color={colorFull}>
        <Note
          filled={1}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={2} color={colorFull}>
        <Note
          filled={2}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={3} color={colorFull}>
        <Note
          filled={3}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={4} color={colorFull}>
        <Note
          filled={4}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
      <Cell preview={true} isPlaying={false} filled={5} color={colorFull}>
        <Note
          filled={5}
          preview={true}
          color={
            color ? colorFull : Color(theme.background.default).hsl().toString()
          }
          previewColor={color050}
        />
      </Cell>
    </>
  );
};
