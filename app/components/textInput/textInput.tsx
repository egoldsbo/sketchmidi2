import React from 'react';

import styled from '@emotion/styled';
import Color from 'color';
import PropTypes from 'prop-types';

const Input = styled.input`
  outline: none;
  appearance: none;
  font-size: 1rem;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(0.5, 1.5)};
  line-height: 1.75;
  font-weight: bold;
  margin-right: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.radius};
  border-style: solid;
  border-width: 1.3pt;
  width: ${({ width }) => width};
  min-width: 4rem;

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
`;

const TextInput = ({ color, inverse, value, onChange, pattern }) => {
  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();

  const width = String(value).length * 0.7 + 'rem';

  return (
    <Input
      width={width}
      type="text"
      onChange={(e) => {
        const regex = new RegExp(`^${pattern}$`);

        if (!pattern || regex.test(e.target.value)) {
          onChange(e.target.value);
        }
      }}
      color={colorFull}
      color025={color025}
      inverse={inverse}
      value={value}
      pattern={pattern}
    />
  );
};

TextInput.defaultProps = {
  inverse: false,
  color: '#ffffff',
};

TextInput.propTypes = {
  color: PropTypes.string,
  inverse: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func,
  pattern: PropTypes.string,
};

export default TextInput;
