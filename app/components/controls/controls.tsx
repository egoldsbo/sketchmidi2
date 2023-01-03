import React from 'react';

import { TRACK_MODE } from '../../constants/modes';

import styled from '@emotion/styled';
import PropTypes from 'prop-types';

import { faLevelUpAlt, faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../button/button';
import Select from '../select/select';
import RangeInput from '../rangeInput/rangeInput';

const channels = new Array(16).fill(0).map((a, i) => ({value: i, label: `CH ${i+1}`}));
const oct = new Array(10).fill(0).map((a, i) => ({value: i, label: `Oct ${i}`}));

const rowOptions = [
  {
    value: 8,
    label: '8 rows',
  },
  {
    value: 15,
    label: '15 rows',
  },
]

const mods = [
  {
    value: TRACK_MODE.MONO,
    label: 'Mono',
  },
  {
    value: TRACK_MODE.POLY,
    label: 'Poly',
  },
  {
    value: TRACK_MODE.BEAT,
    label: 'Beat',
  },
];

const Wrap = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  background: transparent;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
`;

const ListSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    margin: 0 8px;
  }
`;

const Controls = ({
  isPattern,
  setIsPattern,
  color,
  inverse,
  octave,
  setOctave,
 channel,
  setChannel,
  mode,
  setMode,
  rows,
  setRows,
  randomThreshold,
  setRandomThreshold,
}) => (
  <Wrap>
    <Actions>
      <Button onClick={setIsPattern}
        color={color}
        inverse
        title={        isPattern ? (
          "Pattern"
        ) : (
          "Measure"
        )

        }
      >
        Loop{" "}
        {isPattern ? (
          <FontAwesomeIcon icon={faLevelDownAlt} />
        ) : (
          <FontAwesomeIcon icon={faLevelUpAlt} />
        )}
      </Button>
    </Actions>
    <ListSelect>
      <span>Probability:</span>
      <RangeInput
        value={randomThreshold}
        onChange={setRandomThreshold}
        min={0}
        max={100}
        step={1}
        inverse
        color={color}
      />
      <Select
        options={rowOptions}
        selected={rows}
        onSelectChange={setRows}
        color={color}
        inverse={inverse}
        showEmpty={false}
      />
      <Select
        options={channels}
        selected={channel}
        onSelectChange={setChannel}
        color={color}
        inverse={inverse}
        showEmpty={false}
      />
      <Select
        options={mods}
        color={color}
        selected={mode}
        onSelectChange={setMode}
        inverse={inverse}
        showEmpty={false}
      />
      <Select
        selected={octave}
        onSelectChange={setOctave}
        options={oct}
        color={color}
        inverse={inverse}
        showEmpty={false}
      />
    </ListSelect>
  </Wrap>
);

Controls.defaultProps = {
  color: '#ffffff',
};

Controls.propTypes = {
  isPattern: PropTypes.bool.isRequired,
  setIsPattern: PropTypes.func.isRequired,
  inverse: PropTypes.bool.isRequired,
  color: PropTypes.string,
  octave: PropTypes.number,
  setOctave: PropTypes.func,
  channel: PropTypes.number,
  setChannel: PropTypes.func,
  mode: PropTypes.bool,
  setMode: PropTypes.func,
  rows: PropTypes.number,
  setRows: PropTypes.func,
  randomThreshold: PropTypes.number,
  setRandomThreshold: PropTypes.func,
};

export default Controls;
