import React, { useMemo, useCallback } from 'react';
import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';

const NOTE_THICKNESS = '90%';
const HALF_NOTE_WIDTH = '85%';

const CellStyle = styled('button', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'color',
})`
  position: relative;
  flex: 1;
  width: 100%;
  outline: none;
  cursor: pointer;
  border: none;
  padding: 2px 0;
  background-color: ${({ isPlaying, preview, highlighted }) =>
    !highlighted
      ? isPlaying && preview
        ? '#424242'
        : '#212121'
      : isPlaying && preview
      ? '#565656'
      : '#353535'};

  ${({ colHighlight, colHighlightColor }) => {
    if (colHighlight) {
      return `background-color: ${colHighlightColor};`;
    }
    return '';
  }}

  align-items: center;
  display: flex;

  border-bottom: 1px solid ${({ color }) => color};
  border-color: ${({ color, preview }) => (preview ? '#888' : color)};

  &:last-of-type {
    border-bottom: none;
  }
`;

export const Cell = React.memo(CellStyle, (props, nextProps) => {
  const isInsideUpdateArea =
    props.x >= nextProps.minX &&
    props.x <= nextProps.maxX &&
    props.y >= nextProps.minY &&
    props.y <= nextProps.maxY;

  return (
    !isInsideUpdateArea &&
    props.isPlaying === nextProps.isPlaying &&
    props.filled === nextProps.filled &&
    props.color === nextProps.color &&
    props.highlighted === nextProps.highlighted &&
    props.colHighlight === nextProps.colHighlight
  );
});

export const Note = styled.div`
  border: none;
  min-height: ${({ preview }) => (preview ? '4px' : '10px')};
  max-height: 40px;
  border-radius: ${({ theme, preview }) => (preview ? '0px' : theme.radius)};
  height: ${({ theme, preview }) =>
    preview ? theme.spacing('100%') : theme.spacing(NOTE_THICKNESS)};
  ${({ preview, filled, color, previewColor }) => {
    if (preview) {
      return filled ? `color: ${previewColor};` : `color: transparent;`;
    }

    return filled ? `color: ${color};` : `color: transparent;`;
  }};

  background-color: currentColor;

  ${({ preview, filled, theme }) => {
    switch (filled % 6) {
      case 1:
      default:
        return `
          width: ${preview ? theme.spacing('100%') : theme.spacing('70%')};
          margin: ${preview ? '0 3px' : '0 auto'};
        `;
      case 2:
        return `
          width: 110%;
          border-radius: 0;
          margin: 0 auto;
        `;
      case 3:
        return `
          width: ${theme.spacing(HALF_NOTE_WIDTH)};
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin: 0 auto 0 0;
        `;
      case 4:
        return `
          width: ${theme.spacing(HALF_NOTE_WIDTH)};
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          margin: 0 0 0 auto;
        `;
      case 5:
        return `
          width: ${theme.spacing(HALF_NOTE_WIDTH)};
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin: 0 auto 0 0;

          &::after {
            content: '';
            display: block;
            background: currentColor;
            position: absolute;

            border-radius: ${preview ? '0px' : theme.radius};
            width: ${theme.spacing(HALF_NOTE_WIDTH)};
            height: ${
              preview
                ? theme.spacing('calc(100% - 4px)')
                : theme.spacing(NOTE_THICKNESS)
            };
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            right: 0;
          }
        `;
    }
  }}
`;
