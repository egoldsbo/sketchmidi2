import React from 'react';

import styled from '@emotion/styled';
import Color from 'color';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const Container = styled.button`
  cursor: pointer;
  outline: none;
  appearance: none;
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing(0.5, 1.5)};
  line-height: 1.75;
  text-transform: uppercase;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.radius};
  border-style: solid;
  border-width: 1.3pt;

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

const Button = ({ color, children, inverse, onClick, style, className, title }) => {
  const theme = useTheme();

  if (!color) {
    color = theme.background.default;
  }
  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();

  return (
    <Container
      color={colorFull}
      color025={color025}
      inverse={inverse}
      onClick={() => onClick()}
      style={style}
      className={className}
      title={title}
    >
      {children}
    </Container>
  );
};

Button.defaultProps = {
  inverse: false,
  color: null,
  onClick: () => {},
};

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
  inverse: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
