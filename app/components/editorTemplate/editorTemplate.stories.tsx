import React, { useState } from 'react';

import styled from '@emotion/styled';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { number, boolean } from '@storybook/addon-knobs';

import Button from '../button';
import Controls from '../controls';
import EditorNavbar from '../editorNavbar/editorNavbar';
import Filler from '../filler';
import Preview from '../preview';
import StepSequencer from '../stepSequencer/stepSequencer';
import generateMatrix from '../utils/generateMatrix';
import EditorTemplate from './editorTemplate';

export default {
  component: EditorTemplate,
  title: 'Template/Editor',
};

export const template = () => {
  return (
    <EditorTemplate
      navbar={<Filler color="yellow"> Navbar </Filler>}
      main={<Filler color="blue"> Step sequencer </Filler>}
      controls={<Filler color="red"> Controls </Filler>}
      preview={<Filler color="lightblue"> Preview </Filler>}
    />
  );
};

const Menu = styled.div`
  width: 100%;
  height: 100%;
`;

export const EditorPage = () => {
  const rows = number('rows', 8);
  const columns = number('columns', 16);
  let highlighted = number('highlightedColumn', 0);
  const isPlaying = boolean('isPlaying', false);
  let subDivisions = number('SubDivisions', 4);
  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);
  const [tracks, setTracks] = useState([
    {
      name: 'Example',
      color: '#fe281d',
      notes: [
        [4, 4, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 1, 0, 0, 1, 0],
        [2, 2, 0, 2, 0, 0, 1, 0],
        [2, 2, 0, 3, 0, 0, 1, 0],
        [2, 2, 0, 4, 0, 0, 1, 0],
        [2, 2, 0, 5, 0, 0, 1, 0],
        [3, 2, 0, 0, 0, 0, 1, 0],
        [1, 5, 0, 0, 0, 0, 1, 0],
        [4, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [2, 2, 0, 0, 0, 0, 1, 0],
        [3, 3, 0, 0, 0, 0, 1, 0],
      ],
    },
  ]);

  const currentTrack = tracks[selectedTab];

  const selectTab = (i) => {
    setSelectedTab(i);
  };

  const startUpdating = () => (event) => {
    setIsUpdating({ x: event.clientX });
  };

  const stopUpdating = () => () => {
    setIsUpdating(false);
  };

  const updateCell = (x, y) => (event) => {
    if (!isUpdating) {
      return;
    }

    let shouldFill = event.clientX - isUpdating.x >= 0;

    setTracks((tracks) => {
      const newTracks = tracks.map((track, t) => {
        if (t === selectedTab) {
          const newNotes = track.notes.map((col, i) => {
            if (i === x) {
              return col.map((cell, j) => {
                if (j === y) {
                  if (shouldFill) {
                    return 1;
                  } else {
                    return 0;
                  }
                }

                return cell;
              });
            }

            return col;
          });

          return {
            ...track,
            notes: newNotes,
          };
        }

        return track;
      });

      return newTracks;
    });
  };

  return (
    <EditorTemplate
      color={currentTrack.color}
      navbar={
        <EditorNavbar
          tabs={tracks}
          selectedTab={selectedTab}
          selectTab={selectTab}
          isPlaying={isPlaying}
          addTab={() => {
            let newColor = Math.floor(Math.random() * 255 * 255 * 255);
            setTracks([
              ...tracks,
              {
                name: '',
                color: `#${newColor.toString(16).padStart(6, '0')}`,
                notes: generateMatrix(columns, rows),
              },
            ]);
          }}
          menu={
            <Menu>
              <Button inverse> Load </Button>
              <Button inverse> Save </Button>
              <Button inverse>
                <FontAwesomeIcon icon={faCog} />
              </Button>
            </Menu>
          }
        />
      }
      main={
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <StepSequencer
            matrix={currentTrack.notes}
            highlighted={highlighted}
            color={currentTrack.color}
            updateCell={updateCell}
            isPlaying={isPlaying}
            subDivisions={subDivisions}
            startUpdating={startUpdating}
            stopUpdating={stopUpdating}
          />
          <Filler color="rgba(255,255,255,0.3)" width="62px"></Filler>
        </div>
      }
      controls={<Controls color={currentTrack.color} inverse />}
      preview={
        <Preview
          pattern={[
            currentTrack.notes,
            currentTrack.notes,
            currentTrack.notes,
            currentTrack.notes,
          ]}
          patternUp={() => {}}
          patternDown={() => {}}
          highlighted={0}
          isPlaying={false}
          color={currentTrack.color}
          currentPattern={0}
        />
      }
    />
  );
};
