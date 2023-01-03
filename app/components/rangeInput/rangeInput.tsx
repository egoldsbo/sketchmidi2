import React from 'react';

import styled from '@emotion/styled';
import Color from 'color';
import PropTypes from 'prop-types';

const Input = styled.input`
  outline: none;
  appearance: none;
  font-size: 1rem;
  text-align: center;
  font-weight: 400;
  margin: 0;
  border-radius: ${({ theme }) => theme.radius};
  border-style: solid;
  border-width: 1px;
  width: ${({ width }) => width};
  min-width: 5rem;

  ${({ color, color025, inverse, theme }) =>
    inverse
      ? `
        background-color: ${color025};
        border-color: ${color};
        color: ${color};
      `
      : `
        background-color: ${color};
        border-color: ${color};
        color: ${theme.colors.primary};
      `}

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    box-sizing: border-box;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: ${({ theme }) => theme.radius};
    cursor: pointer;

    ${({ color, color025, inverse, theme }) =>
      inverse
        ? `
          background-color: ${color025};
          border-color: ${color};
          color: ${color};
        `
        : `
          background-color: ${color};
          border-color: ${color};
          color: ${theme.colors.primary};
        `}
  }
`;

const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
`;

const Value = styled.span`
  position: absolute;
  user-select: none;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 400;
  pointer-events: none;

  ${({ color, inverse, theme }) =>
    inverse
      ? `
          color: ${color};
        `
      : `
          color: ${theme.colors.primary};
        `}
`;

const RangeInput = ({ color, inverse, value, onChange, min, max, step }) => {
  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();

  const width = String(value).length * 0.7 + 'rem';

  return (
    <Container>
      <Value color={colorFull} color025={color025} inverse={inverse}>
        {value}
      </Value>
      <Input
        width={width}
        type="range"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        color={colorFull}
        color025={color025}
        inverse={inverse}
        value={value}
        min={min}
        max={max}
        step={step}
      />
    </Container>
  );
};

RangeInput.defaultProps = {
  inverse: false,
  color: '#ffffff',
  step: 1,
};

RangeInput.propTypes = {
  color: PropTypes.string,
  inverse: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export default RangeInput;
