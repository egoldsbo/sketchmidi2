import React, { useRef, useMemo } from 'react';

import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import {
  faCopy,
  faArrowDown,
  faTrashAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../button/button';
import Stepper from '../stepper/stepper';
import StepSequencer from '../stepSequencer/stepSequencer';

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const alphabet = new Array(26)
  .fill(65)
  .map((a, i) => String.fromCharCode(a + i));

const Wrap = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas: 's s s s step' 'c1 c2 c3 c4 clear';
  height: 100%;
  width: 100%;
  color: white;
`;

const ClearWrapper = styled.div`
  grid-area: clear;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  button {
    height: 48px;
  }
`;

const SectionControlWrapper = styled.div`
  grid-area: ${({ area }) => area};
  display: flex;
  // justify-content: space-between;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1)};
  position: relative;
  left: -2px;

  border-left: 2px solid;
  border-color: ${({ color }) => color};
  ${({ highlighted }) =>
    !highlighted
      ? ''
      : `
    background: #2A2A2A;
  `}
`;

const PreviewWrapper = styled.div`
  grid-area: s;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border: 1px solid ${({ color }) => color};
  border-top: none;
  border-left: none;
  height: 100%;
`;

const StepperWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  grid-area: step;
`;

const romanNumerals = [
  '-I',
  '-II',
  '-III',
  '-IV',
  '-V',
  '-VI',
  '-VII',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  '+I',
];

const SectionControl_ = ({
  area,
  color,
  onCopyPaste,
  transpose,
  transposeUp,
  transposeDown,
  isPasting = false,
  isCopying = false,
  highlighted = false,
}) => {
  return (
    <SectionControlWrapper area={area} color={color} highlighted={highlighted}>
      {/*
      <Button onClick={onCopyPaste} color={color} inverse>
        <FontAwesomeIcon
          icon={isCopying ? faTimes : isPasting ? faArrowDown : faCopy}
        />
      </Button>
      */}
      <Stepper
        value={transpose}
        countUp={transposeUp}
        countDown={transposeDown}
        min={0}
        max={15}
        step={1}
        items={romanNumerals}
        color="#ffffff"
      />
    </SectionControlWrapper>
  );
};

const SectionControl = React.memo(SectionControl_, (cur, next) => {
  return cur.color === next.color &&
    cur.transpose === next.transpose &&
    cur.isCopying === next.isCopying &&
    cur.highlighted === next.highlighted
})

const DndStepSequencer = ({
  i,
  matrix,
  highlighted,
  subDivisions,
  isPlaying,
  color,
  showLastDivider,
  preview,
  onClick,
  onDrop,
  isSelected,
}) => {
  const ref = useRef(null);

  const name = `StepSequencer-${i}`;
  const [{ isDragging }, drag] = useDrag({
    item: { name, type: 'StepSequencer' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(i, dropResult.i);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'StepSequencer',
    drop: () => ({ name, i }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));
  return (
    <StepSequencer
      ref={ref}
      matrix={matrix}
      subDivisions={subDivisions}
      isPlaying={isPlaying}
      color={color}
      showLastDivider={showLastDivider}
      preview={preview}
      onClick={onClick}
      isSelected={isSelected}
      highlighted={highlighted}
    />
  );
};

const Preview = ({
  isPlaying,
  pattern,
  highlighted,
  patternUp,
  patternDown,
  color,
  currentPattern,
  currentSection,
  onSectionClick,
  transpose,
  transposer,
  onTransposeUp,
  onTransposeDown,
  isPasting,
  onCopyPaste,
  clearSection,
  onDrop,
}) => {
  const theme = useTheme();

  // console.log(highlighted);
  const isSection1 = highlighted >= 0 && highlighted <= 15;
  const isSection2 = highlighted >= 16 && highlighted <= 31;
  const isSection3 = highlighted >= 32 && highlighted <= 47;
  const isSection4 = highlighted >= 48 && highlighted <= 63;

  const sectionClick0 = useMemo(() => onSectionClick(0), [onSectionClick]);
  const sectionClick1 = useMemo(() => onSectionClick(1), [onSectionClick]);
  const sectionClick2 = useMemo(() => onSectionClick(2), [onSectionClick]);
  const sectionClick3 = useMemo(() => onSectionClick(3), [onSectionClick]);

  return (
    <Wrap>
      <DndProvider backend={HTML5Backend}>
        <PreviewWrapper color={color}>
          <DndStepSequencer
            i={0}
            matrix={pattern[0]}
            subDivisions={4}
            isPlaying={isPlaying && isSection1}
            color={color}
            showLastDivider
            preview
            onClick={sectionClick0}
            onDrop={onDrop}
            isSelected={isSection1 && currentSection}
            highlighted={highlighted % 16}
          />
          <DndStepSequencer
            i={1}
            matrix={pattern[1]}
            subDivisions={4}
            isPlaying={isPlaying && isSection2}
            color={color}
            showLastDivider
            preview
            onClick={sectionClick1}
            onDrop={onDrop}
            isSelected={isSection2 && currentSection}
            highlighted={highlighted % 16}
          />
          <DndStepSequencer
            i={2}
            matrix={pattern[2]}
            subDivisions={4}
            isPlaying={isPlaying && isSection3}
            color={color}
            showLastDivider
            preview
            onClick={sectionClick2}
            onDrop={onDrop}
            isSelected={isSection3 && currentSection}
            highlighted={highlighted % 16}
          />
          <DndStepSequencer
            i={3}
            matrix={pattern[3]}
            subDivisions={4}
            isPlaying={isPlaying && isSection4}
            color={color}
            preview
            onClick={sectionClick3}
            last
            onDrop={onDrop}
            isSelected={isSection4 && currentSection}
            highlighted={highlighted % 16}
          />
        </PreviewWrapper>
        <SectionControl
          area="c1"
          color={color}
          transpose={transpose[0]}
          transposeUp={() => onTransposeUp(0)}
          transposeDown={() => onTransposeDown(0)}
          isPasting={isPasting}
          isCopying={isPasting === '0'}
          onCopyPaste={onCopyPaste(0)}
          highlighted={transposer === 0}
        />
        <SectionControl
          area="c2"
          color={color}
          transpose={transpose[1]}
          transposeUp={() => onTransposeUp(1)}
          transposeDown={() => onTransposeDown(1)}
          isPasting={isPasting}
          isCopying={isPasting === '1'}
          onCopyPaste={onCopyPaste(1)}
          highlighted={transposer === 1}
        />
        <SectionControl
          area="c3"
          color={color}
          transpose={transpose[2]}
          transposeUp={() => onTransposeUp(2)}
          transposeDown={() => onTransposeDown(2)}
          isPasting={isPasting}
          isCopying={isPasting === '2'}
          onCopyPaste={onCopyPaste(2)}
          highlighted={transposer === 2}
        />
        <SectionControl
          area="c4"
          color={color}
          transpose={transpose[3]}
          transposeUp={() => onTransposeUp(3)}
          transposeDown={() => onTransposeDown(3)}
          isPasting={isPasting}
          isCopying={isPasting === '3'}
          onCopyPaste={onCopyPaste(3)}
          highlighted={transposer === 3}
        />
        <StepperWrapper>
          <Stepper
            value={currentPattern}
            backless
            vertical
            inverse
            countUp={patternUp}
            countDown={patternDown}
            color='white'
            items={alphabet}
          />
        </StepperWrapper>
        <ClearWrapper>
          <Button onClick={clearSection} color={color} inverse>
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </ClearWrapper>
      </DndProvider>
    </Wrap>
  );
};

Preview.defaultProps = {
  isPlaying: false,
  onSectionClick: () => {},
};

Preview.propTypes = {
  pattern: PropTypes.arrayOf(PropTypes.array).isRequired,
  patternUp: PropTypes.func.isRequired,
  patternDown: PropTypes.func.isRequired,
  highlighted: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool,
  color: PropTypes.string.isRequired,
  currentPattern: PropTypes.number.isRequired,
  onSectionClick: PropTypes.func,
};

export default Preview;
