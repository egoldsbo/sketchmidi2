import React, { useMemo } from 'react';

import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import Color from 'color';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

import { Cell, Note } from '../cell/cell';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background: transparent;
`;

const ColumnDivider_ = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'color',
})`
  height: 100%;
  color: ${({ color }) => color};
  position: relative;

  ${({ subDivision, preview, last, isPlaying }) =>
    subDivision
      ? `
    left: -1.5px;
    width: 3px;
    background-image: linear-gradient(
      180deg,
      currentColor,
      currentColor ${preview ? '60%' : '80%'},
      transparent ${preview ? '60%' : '80%'},
      transparent 100%
    );
    background-size: 1px ${preview ? '10px' : '20px'};
    background-position: 0 -5px;
    ${
      (preview && !last) || !preview
        ? isPlaying
          ? 'background-color: transparent;'
          : 'background-color: transparent;'
        : 'background-color: currentColor;'
    }
    `
      : `
    left: -0.5px;
    width: 1px;
    background: currentColor;
    `}
`;

const ColumnDivider = React.memo(ColumnDivider_, (props, nextProps) => {
  return props.color === nextProps.color;
});

const Column = styled('div', {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'color',
})`
  flex: 1;
  position: relative;
  height: auto;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius};
  align-items: center;
  justify-content: space-between;
`;

const ColumnsContainer = styled.div`
  position: absolute;
  top: 0;
  left: -1.5px;
  width: calc(100% + 4px);
  height: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  pointer-events: none;
`;

const StepSequencerWithRef = (
  {
    matrix,
    isPlaying,
    highlighted,
    color,
    subDivisions,
    preview,
    startUpdating,
    stopUpdating,
    last,
    onClick,
    onMove,
    finalCell = {x: -2, y: -2},
    startCell,
  },
  ref
) => {
  const theme = useTheme();
  let columnsPerSubDivision = useMemo(
    () => Math.floor(matrix.length / subDivisions),
    [subDivisions]
  );

  const colorFull = useMemo(() => Color(color).hsl().toString(), [color]);
  const color025 = useMemo(
    () => Color(color).hsl().alpha(0.25).toString(),
    [color]
  );
  const color050 = useMemo(
    () => Color(color).hsl().alpha(0.5).toString(),
    [color]
  );
  const color075 = useMemo(
    () => Color(color).hsl().alpha(0.75).toString(),
    [color]
  );

  if(!startCell) {
    startCell = finalCell;
  }

  const minX = Math.min(startCell.x, finalCell.x) - 1;
  const maxX = Math.max(startCell.x, finalCell.x) + 1;
  const y = finalCell.y;
  const minY = y - 1 >= 0 ? y - 1 : y;
  const maxY = y + 1 <= 15 ? y + 1 : y;
  // console.log(minX, maxX, minY, maxY);

  const grid = useMemo(
    () => () => {
      let columnsElements = [];

      for (let i = 0; i <= matrix.length; i++) {
        const shouldShowColumn =
          (preview && i > 0 && !(last && i == matrix.length)) ||
          (!preview && i > 0 && i <= matrix.length - 1);

        let color = preview ? '#888' : colorFull;

        columnsElements.push(
          <ColumnDivider
            key={'columnDivider' + i}
            preview={preview}
            isPlaying={isPlaying}
            last={i === matrix.length - 1}
            subDivision={i % columnsPerSubDivision === 0}
            color={shouldShowColumn ? color : 'transparent'}
          />
        );
      }

      return columnsElements;
    },
    [subDivisions, color]
  );

  const is15 = matrix[0].length === 15;
  // console.log('col', highlighted);

  return (
    <Container onPointerDown={onClick} ref={ref}>
      <ColumnsContainer>{grid()}</ColumnsContainer>

      {matrix.map((column, x) => {
        return (
          <Column
            key={'column' + x}
          >
            {column.map((cell, y) => {
              const cor = cell >= 6 ? color050 : colorFull;
              return (
                <Cell
                  preview={preview}
                  isPlaying={isPlaying}
                  filled={cell}
                  key={'cell.' + x + '.' + y}
                  onPointerDown={(event) => startUpdating({event, x, y})}
                  onPointerUp={(event) => stopUpdating({event, x, y})}
                  onPointerEnter={(event) => onMove({event, x, y})}
                  color={colorFull}
                  highlighted={is15 && y === 7}
                  colHighlight={isPlaying && x === highlighted}
                  colHighlightColor={preview ? color075 : color025}
                  x={x}
                  y={y}
                  minX={minX}
                  maxX={maxX}
                  minY={minY}
                  maxY={maxY}
                >
                  <Note
                    key={'note.' + x + '.' + y}
                    filled={cell}
                    color={cor}
                    previewColor={color050}
                    preview={preview}
                  />
                </Cell>
              );
            })}
          </Column>
        );
      })}
    </Container>
  );
};

const StepSequencer = React.memo(React.forwardRef(StepSequencerWithRef), (props, newProps) => {
  return JSON.stringify(props) === JSON.stringify(newProps);
});

StepSequencer.defaultProps = {
  color: '#ff0000',
  preview: false,
  startUpdating: () => {},
  stopUpdating: () => {},
  onClick: () => {},
  onMove: () => {},
  last: false,
};

StepSequencer.propTypes = {
  matrix: PropTypes.arrayOf(PropTypes.array).isRequired,
  isPlaying: PropTypes.bool,
  preview: PropTypes.bool,
  color: PropTypes.string,
  subDivisions: PropTypes.number.isRequired,
  startUpdating: PropTypes.func,
  stopUpdating: PropTypes.func,
  onClick: PropTypes.func,
  onMove: PropTypes.func,
  last: PropTypes.bool,
  startCell: PropTypes.object,
  finalCell: PropTypes.object,
};

export default StepSequencer;
