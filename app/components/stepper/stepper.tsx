import React from 'react';

import styled from '@emotion/styled';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Color from 'color';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: max-content;
  height: max-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline: none;
  appearance: none;
  font-size: 1rem;
  padding: ${({ backless, theme }) => backless ? '0' : theme.spacing(1)};
  border-radius: ${({ theme }) => theme.radius};
  border-style: solid;
  border-width: 1px;
  flex-direction: ${({ vertical, inverse }) =>
    vertical
      ? inverse
        ? 'column'
        : 'column-reverse'
      : inverse
      ? 'row-reverse'
      : 'row'};

  ${({ color, background, backless }) => !backless ? `
        background-color: ${background};
        border-color: ${color};
    ` : `
    border: none;
    background: none;

  `}

  button {
    outline: none;
    border-radius: ${({ theme }) => theme.radius};
    font-size: 0.7rem;
    color: ${({ color }) => `${color}`};
    width: ${({ theme }) => theme.spacing(3)};
    height: ${({ theme }) => theme.spacing(3)};
    ${({ color, background }) => `
        background-color: ${background};
        border: 0.5px solid ${color};
      `}
    cursor: pointer;
  }

  span {
    min-width: 1.8em;
    text-align: center;
    font-weight: 400;
    padding: ${({ theme }) => theme.spacing(0.5)};
    ${({ color, theme }) =>
      color ? `color: ${color};` : `color: ${theme.colors.primary};`}
  }
`;

const Stepper = ({
  color,
  min,
  max,
  step,
  value,
  countUp,
  countDown,
  vertical,
  className,
  style,
  items = [],
  inverse,
  backless,
}) => {
  if (items && items.length) {
    max = items.length;
    min = 0;
  }

  const theme = useTheme();

  const onUp = () => {
    let newValue = value + step;

    if (typeof max !== 'undefined') {
      newValue = Math.min(max, newValue);
    }

    countUp(newValue);
  };

  const onDown = () => {
    let newValue = value - step;

    if (typeof min !== 'undefined') {
      newValue = Math.max(min, newValue);
    }

    countDown(newValue);
  };

  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();

  return (
    <Container
      className={className}
      backless={backless}
      style={style}
      color={
        color ? colorFull : Color(theme.background.default).hsl().toString()
      }
      background={color025}
      inverse={inverse}
      vertical={vertical}>
      <button onClick={onDown}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <span>{items && items.length ? items[value] : value.toString()}</span>
      <button onClick={onUp}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </Container>
  );
};

Stepper.defaultProps = {
  color: '',
  step: 1,
  min: undefined,
  max: undefined,
  vertical: false,
  className: '',
  style: {},
  items: [],
  inverse: false,
  backless: true,
};

Stepper.propTypes = {
  value: PropTypes.number.isRequired,
  countUp: PropTypes.func.isRequired,
  countDown: PropTypes.func.isRequired,
  step: PropTypes.number,
  color: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  backless: PropTypes.bool,
  vertical: PropTypes.bool,
  inverse: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.string),
};

export default Stepper;
