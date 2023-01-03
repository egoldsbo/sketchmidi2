import React from 'react';

import styled from '@emotion/styled';
import Color from 'color';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
`;

const Thumb = styled.div`
  width: ${({ theme }) => theme.spacing(4)};
  height: ${({ theme }) => theme.spacing(4)};

  border-radius: ${({ theme }) => theme.radius};
  position: absolute;
  z-index: 1;

  ${({ vertical }) =>
    vertical
      ? ` transition: bottom 0.4s ease-out;`
      : ` transition: left 0.4s ease-out;`}
`;

const Text = styled.span`
  ${({ color }) => `color: ${color};`}
  padding: ${({ theme }) => theme.spacing(1)};
  line-height: 1.75;
  text-transform: uppercase;
`;

const TrackColor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  ${({ vertical }) =>
    vertical
      ? `bottom: 0; transition: height 0.4s ease-out;`
      : `transition: width 0.4s ease-out;`}
`;

const Box = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  padding: 0;
  position: relative;
  overflow: hidden;
  appearance: none;
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius};
  border: 2px solid ${({ color }) => color};
  background-color: ${({ background025, backgroundTrack, bothOn }) =>
    bothOn ? backgroundTrack : background025};

  ${({ vertical, active, theme, color, backgroundTrack, bothOn }) =>
    vertical
      ? `
  width: 32px;
  height: 100px;
  align-items: flex-start;

  ${Thumb}{
    bottom: ${active ? `calc(100% - 32px)` : '0%'};
    right: -2px;
    background-color: ${color};
        border-color: 2px solid ${color};
  }

  ${
    bothOn
      ? ''
      : `
  ${TrackColor} {
    height: ${active ? `calc(100% - ${theme.spacing(2)})` : theme.spacing(2)};
    background-color: ${backgroundTrack};
  }`
  }
  
  `
      : `
      
  width: ${theme.spacing(8)};
  height: ${theme.spacing(4)};
  ${Thumb}{
    left: ${active ? `calc(100% - ${theme.spacing(4)})` : '0%'};
    background-color: ${color};
    border-color: 2px solid ${color};
  }

  ${
    bothOn
      ? ''
      : `
  ${TrackColor} {
    width: ${active ? `calc(100% - ${theme.spacing(2)})` : theme.spacing(2)};
    background-color: ${backgroundTrack};
  }`
  }
  `}
`;

const Switch = ({
  on,
  off,
  color,
  isActive,
  setIsActive,
  width,
  vertical,
  bothOn,
}) => {
  const theme = useTheme();

  const colorFull = Color(color).hsl().toString();
  const color025 = Color(color).hsl().alpha(0.25).toString();
  const color050 = Color(color).hsl().alpha(0.5).toString();

  return (
    <Container>
      <Text
        color={
          color ? colorFull : Color(theme.colors.primary).hsl().toString()
        }>
        {on}
      </Text>
      <Box
        vertical={vertical}
        onClick={() => setIsActive(!isActive)}
        active={isActive}
        color={
          color ? colorFull : Color(theme.background.default).hsl().toString()
        }
        backgroundTrack={color050}
        background025={color025}
        width={width}
        bothOn={bothOn}>
        <Thumb active={isActive} vertical={vertical} />
        <TrackColor active={isActive} vertical={vertical} />
      </Box>
      <Text
        color={
          color ? colorFull : Color(theme.colors.primary).hsl().toString()
        }>
        {off}
      </Text>
    </Container>
  );
};

Switch.defaultProps = {
  on: '',
  off: '',
  color: '#ffffff',
  width: '',
  vertical: false,
  bothOn: false,
};

Switch.propTypes = {
  on: PropTypes.string,
  off: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  setIsActive: PropTypes.func.isRequired,
  vertical: PropTypes.bool,
  bothOn: PropTypes.bool,
};

export default Switch;
