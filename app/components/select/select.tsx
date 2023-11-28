import React, { useState } from 'react';

import styled from '@emotion/styled';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Color from 'color';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const Symbol = styled.span`
  position: absolute;
  display: inline-flex;
  height: 100%;
  align-items: center;
  right: 0;
  pointer-events: none;
  margin-right: ${({ theme }) => theme.spacing(1.5)};
`;

const Box = styled.div`
  position: relative;
  max-width: max-content;

  ${({ color, inverse, theme }) =>
    inverse
      ? `
        color: ${color};
      `
      : `
        color: ${theme.colors.primary};
      `}
`;

const SelectInput = styled.select`
  outline: none;
  appearance: none;

  position: relative;

  font-size: 1rem;
  line-height: 1.75;
  padding: ${({ theme }) => theme.spacing(0.5, 2.5, 0.5, 1.5)};
  border-radius: ${({ theme }) => theme.radius};
  border-style: solid;
  border-width: 1px;
  color: inherit;

  ${({ color, color025, inverse }) =>
    inverse
      ? `
        background-color: ${color025};
        border-color: ${color};
      `
      : `
        background-color: ${color};
        border-color: ${color};
      `}

  option {
    ${({ color, color025, inverse }) =>
      inverse
        ? `
        background-color: ${color025};
        border-color: ${color};
      `
        : `
        background-color: ${color};
        border-color: ${color};
      `}
  }
`;

const Select = ({
  color,
  inverse,
  options,
  showEmpty,
  emptyLabel,
  selected,
  onSelectChange,
}) => {
  const theme = useTheme();
  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();
  const [isActive, setIsActive] = useState(false);
  const onChange = (e) => onSelectChange(e.currentTarget.value);
  const onClick = () => setIsActive(!isActive);

  return (
    <Box
      color={
        color ? colorFull : Color(theme.background.default).hsl().toString()
      }
      inverse={inverse}
    >
      <SelectInput
        active={isActive}
        onClick={onClick}
        color={color ? color : Color(theme.background.default).hsl().toString()}
        color025={color025}
        inverse={inverse}
        value={selected}
        onChange={onChange}
      >
        {showEmpty && (
          <option key="" value={emptyLabel}>
            Select one
          </option>
        )}
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label ? label : value}
          </option>
        ))}
      </SelectInput>
      <Symbol>
        <FontAwesomeIcon icon={faCaretDown} />
      </Symbol>
    </Box>
  );
};

Select.defaultProps = {
  color: '#ffffff',
  inverse: false,
  options: [],
  showEmpty: true,
  emptyLabel: 'Select one',
};

Select.propTypes = {
  color: PropTypes.string,
  inverse: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string,
    })
  ),
  showEmpty: PropTypes.bool,
  emptyLabel: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSelectChange: PropTypes.func,
};

export default Select;
