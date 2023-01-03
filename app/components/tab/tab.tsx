import React, { useState, useCallback } from 'react';

import styled from '@emotion/styled';
import {
  faVolumeMute,
  faVolumeUp,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Color from 'color';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  position: relative;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active, color, background }) =>
    active ? background : color};

  ${({ active, color, background }) =>
    !active
      ? ''
      : `
    z-index: 5;
    :before {
      z-index: 3;
      border-style: solid;
      border-color: ${active ? color : 'transparent'};
      border-width: 0px 2px 2px 0px;
      position: absolute;
      bottom: -2px;
      width: 10px;
      height: 10px;
      content: "";

      left: -8px;
      border-bottom-right-radius: 6px;
      box-shadow: 4px 0 0 ${background};
    }

    :after {
      z-index: 3;
      border-style: solid;
      border-color: ${active ? color : 'transparent'};
      border-width: 0px 0px 2px 2px;
      position: absolute;
      bottom: -2px;
      width: 10px;
      height: 10px;
      content: "";

      right: -8px;
      border-bottom-left-radius: 6px;
      box-shadow: -4px 0 0 ${background};
    }
    }

  `}
`;

const InnerContainer = styled.div`
  min-width: 60px;
  min-height: 30px;
  background: ${({ background }) => background};
  padding: 5px 6px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  cursor: pointer;
  border-style: solid;
  border-color: ${({ color }) => color};
  border-width: 2px;
  border-bottom: none;
  text-align: center;
  color: ${({ color }) => color};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ highlight, activeColor }) => (highlight ? `color: ${activeColor};` : '')}
`;

const Mute = styled.div`
  margin-left: 4px;
  border: 1px currentColor solid;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  font-size: 12px;
  align-items: center;
  justify-content: center;
  ${({ show }) => (show ? `display: flex;  padding: 5px;` : `display:none;`)}
`;

const Input = styled.input`
  text-align: center;
  font-family: monospace;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  appearance: none;
  border: none;
  background: none;
  border-bottom: 1px solid currentColor;

  &:focus {
    outline: none;
  }
`;

const Tab = ({
  active,
  color,
  selectTab,
  highlight,
  isMuted,
  showIcon,
  style,
  className,
  setIsMute,
  children,
  label = '',
  setLabel = () => {},
  removeTab = () => {},
  last = false,
}) => {
  const [isEditing, setEditing] = useState(false);
  let parsedColor = Color(color).hsl();

  const onClick = useCallback((e) => {
    selectTab();
    e.stopPropagation();
    setEditing(false);
  }, []);

  const onDoubleClick = useCallback(() => {
    if (!children) setEditing(true);
  }, []);

  const onMute = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMute(!isMuted);
    },
    [isMuted]
  );

  const onDelete = useCallback((e) => {
    e.stopPropagation();
    removeTab();
  }, []);

  const onSelectChange = useCallback((e) => {
    setLabel(e.target.value);
  }, []);

  const inputWidth = React.useMemo(() => {
    return { width: label.length * 9.5 + 10 + 'px' };
  }, [label.length]);

  return (
    <Container
      style={style}
      className={className}
      color={parsedColor.toString()}
      background={parsedColor.darken(0.6).toString()}
      active={active}
    >
      <InnerContainer
        active={active}
        background={parsedColor.darken(0.6).toString()}
        color={parsedColor.toString()}
        activeColor={parsedColor.lighten(0.4).toString()}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        highlight={highlight}
      >
        {children}
        {children ? null : !isEditing || !active ? (
          label
        ) : (
          <Input
            type="text"
            value={label}
            autoFocus={true}
            style={inputWidth}
            maxLength={20}
            onChange={onSelectChange}
          />
        )}
        <Mute show={showIcon} onClick={onMute}>
          <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
        </Mute>
        <Mute
          show={showIcon && isEditing && !last && active}
          onClick={onDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </Mute>
      </InnerContainer>
    </Container>
  );
};

Tab.defaultProps = {
  active: false,
  selectTab: () => {},
  color: '#ffffff',
  highlight: false,
  isMuted: false,
  showIcon: false,
  setIsMute: () => {},
};

Tab.propTypes = {
  active: PropTypes.bool,
  color: PropTypes.string,
  selectTab: PropTypes.func,
  highlight: PropTypes.bool,
  isMuted: PropTypes.bool,
  showIcon: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  setIsMute: PropTypes.func,
};

export default Tab;
