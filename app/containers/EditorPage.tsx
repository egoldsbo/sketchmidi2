import React, {useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch, useStore } from 'react-redux';
import Mousetrap from 'mousetrap';


import { TRACK_MODE, PLAYING_MODE, KEYS, SCALE_TYPE } from '../constants/modes';

import StepSequencer from '../components/stepSequencer';
import Controls from '../components/controls';
import EditorNavbar from '../components/editorNavbar/editorNavbar';
import Button from '../components/button';
import RangeInput from '../components/rangeInput';
import TextInput from '../components/textInput';
import Preview from '../components/preview';
import EditorTemplate from '../components/editorTemplate';
import Modal from '../components/modal';
import HelpModal from '../components/help_modal';
import Select from '../components/select';
import {
  faCog,
  faStop,
  faPlay,
  faExclamation,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from '../components/switch';


import {
  changeChannel,
  changeKey,
  changeMode,
  changeOctave,
  changePlayingNotes,
  changeRows,
  changePlayingMode,
  changeScaleType,
  changeBeatScale,
  changeSwing,
  changeTempo,
  changeTrack,
  createTrack,
  muteTrack,
  updateTrackLabel,
  removeTrack,
  loadTracks,
  overwriteTrackNotes,
  overwriteTrackPattern,
  clearSectionMeasureNotes,
  clearSectionNotes,
  saveTracks,
  updateTransposition,
  updateSelectedPattern,
  updateSelectedSection,
  updateTrackNote,
  updateTrackThreshold,
} from '../redux/actions';

import { cloneMatrix } from '../redux/reducers/tracks';

function onRender(

  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
 // ipcRenderer.send('poster', {post:'id:'});
 // ipcRenderer.send('poster', {post:id});
 // ipcRenderer.send('poster', {post:'actualDuration:'});
 // ipcRenderer.send('poster', {post:actualDuration});
 // ipcRenderer.send('poster', {post:'baseDuration:'});
 // ipcRenderer.send('poster', {post:baseDuration});

}

function debounce(func, delay) {
  let inDebounce;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}



const MAX_TABS = 16;

const scaleOptions = Object.entries(SCALE_TYPE).map(([k, v]) => ({
  value: v,
  label: k,
}));

const keyOptions = Object.entries(KEYS).map(([k, v]) => ({
  value: v,
  label: k,
}));

const Menu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  font-family: nunito;
  margin-left: 8px;
  margin-right: 8px;
`;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function EditorPage() {

    const tracks = useSelector((state) => state.editor.tracks);
    const prevTracks = usePrevious(tracks);

    useEffect(() => {
      if (prevTracks) {
        tracks.forEach((track, index) => {
          const prevTrack = prevTracks[index];
          if (prevTrack && JSON.stringify(track.playingnotes) !== JSON.stringify(prevTrack.playingnotes)) {
            console.log(`Track ${index + 1} playingnotes changed:`, track.playingnotes);
          }
        });
      }
    }, [tracks]);


  const [clockSwitchState, setClockSwitchState] = useState(true);

  const toggleClockSwitch = () => {
    const newState = !clockSwitchState;
    setClockSwitchState(newState);
    // Send the updated state to the main process
    ipcRenderer.send('clock-switch-state', newState);
  };

  const dispatch = useDispatch();
  const store = useStore();

  const [lastPlayedCol, setLastPlayedCol] = useState(0);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [sectionToCopy, setSectionToCopy] = useState(-1);
  const [notesToCopy, setNotesToCopy] = useState(false);
  const [copyType, setCopyType] = useState('section');

  const fullState = useSelector((state) => state);
  const stateToSave = fullState.editor;

  const {
    tempo,
    swing,
    filePath,
    beatScale,
    key: masterKey,
    scaleType: masterScaleType,
    activeTrack: selectedTab,
    currentPattern,
    changesWereSaved: currentStateIsSaved,
    transpositions: allTranspositions,
  } = stateToSave;

  const numberOfTabs = tracks.length;
  const currentTrack = tracks[selectedTab];
  const octave = currentTrack.octave;
  const channel = currentTrack.channel;

  const transpositions = allTranspositions[currentPattern];




  const setOctave = (newOctave) => {
    ipcRenderer.send('midihang', { trackz:currentTrack});
    if (typeof newOctave === 'string') {
      newOctave = parseInt(newOctave, 10);

    }

    notesHaveChanged(false);
    dispatch(changeOctave(newOctave));
  };

  const setChannel = (newChannel) => {
    ipcRenderer.send('midihang', { trackz:currentTrack});
    notesHaveChanged(false);

    dispatch(changeChannel(newChannel));
  };

  const mode = tracks[selectedTab].mode;
  const setMode = (newMode) => {
    ipcRenderer.send('midihang', { trackz:currentTrack});

   const shouldChangeMode = ipcRenderer.sendSync('changeMode', {
      mode,
      newMode
    });

    if (shouldChangeMode) {
      notesHaveChanged(false);
      dispatch(changeMode(newMode));
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const [subDivisions, setSubDivisions] = useState(4);

  const [temporaryNotes, setTemporaryNotes] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdatedCell, setLastUpdatedCell] = useState(false);

  const currentNotes =
    currentTrack.patterns[currentPattern][
      currentTrack.currentSection
    ].notes;

  const setRows = (newRows: string | number) => {
    const shouldChangeMode = ipcRenderer.sendSync('changeRows', {
      rows: currentNotes[0].length,
      newRows,
    });

    if (shouldChangeMode) {
      notesHaveChanged(false);
      dispatch(changeRows(+newRows));
    }
  };


  const currentMatrix = isUpdating ? temporaryNotes : currentNotes;
  // const currentMatrix =  currentNotes;
//irshad
  const notesHaveChanged = (turnOn, event? = 'midi_change', extra?) => {
    let col = lastPlayedCol;
    tracks.forEach((track, t) => {
      let notes;
      if (track.playingMode === PLAYING_MODE.PATTERN) {
        notes = [
          ...track.patterns[currentPattern][0].notes,
          ...track.patterns[currentPattern][1].notes,
          ...track.patterns[currentPattern][2].notes,
          ...track.patterns[currentPattern][3].notes,
        ];
      } else {
        notes =
          track.patterns[currentPattern][track.currentSection].notes;
      }
      const noteCol =
        track.playingMode === PLAYING_MODE.PATTERN ? col : col % 16;

      // console.log(noteCol - 1 >= 0 ? noteCol - 1 : notes.length - 1, col);

      if (!track.isMuted || !turnOn) {
        ipcRenderer.send(event, {
          beatScale,
          playingMode: track.mode,
          previousNotes:
            notes[noteCol - 1 >= 0 ? noteCol - 1 : notes.length - 1],
          notes: notes[noteCol],
          column: noteCol,
          realCol: col,
          octave: track.octave,
          channel: track.channel,
          transpositions,
          key: masterKey,
          scaleType: masterScaleType,
          extra,
        });
      }
    });
  };

  const saveTracksToFile = () => {
    ipcRenderer.send('saveTracksToFile', {
      state: stateToSave,
    });
  };

  const onChangeBeatScale = (i: number) => (beat: string) => {
    for(var j=0;j<tracks.length;j++){
      ipcRenderer.send('midihang', {trackz:tracks[j]});
        }
    notesHaveChanged(false);
    dispatch(changeBeatScale(i, parseInt(beat, 10)));
  };

  const loadTracksFromFile = () => {
    const tracksFromFile = ipcRenderer.sendSync('loadTracksFromFile', {
      filePath,
    });

    dispatch(loadTracks(tracksFromFile));
  };
  const toggleMidiClock = () => {
    ipcRenderer.send('toggleMidiClock');
  };
  useEffect(() => {
    ipcRenderer.send('state', { fullState });
  }, [fullState]);

  //irshad
  const tick = (evt: any, { col }: any) => {
    setLastPlayedCol(col);
  };

  const changeTempoOnTone = (newTempo: number | string) => {
    let t: number;

    if (typeof newTempo === 'string') {
      t = parseInt(newTempo, 10);
    } else {
      t = newTempo;
    }

    dispatch(changeTempo(t));
    ipcRenderer.send('tempoChange', { tempo:t});

  };

  const changeSwingOnTone = (newSwing: number | string) => {
    let swing: number;

    if (typeof newSwing === 'string') {
      swing = parseInt(newSwing, 10);
    } else {
      swing = newSwing;
    }

    dispatch(changeSwing(swing / 100));
    ipcRenderer.send('swingChange', { swing: swing / 100 });
  };

  const toggleIsPlaying = () => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        ipcRenderer.send('panic', tracks);
        ipcRenderer.send('stop');
        tracks.forEach((track, t) => {
          ipcRenderer.send('midihang', { trackz:track});
        });
      } else {
        setLastPlayedCol(0);
        ipcRenderer.send('play');
      }

      return !isPlaying;
    });
  };

  const onCopyPatternShortcut = useCallback(() => {
    setSectionToCopy(0);
    setNotesToCopy(currentTrack.patterns[currentPattern]);
    setCopyType('pattern');
    setIsPasting(true);
  }, [currentTrack]);

  const onCopyShortcut = useCallback(() => {
    setSectionToCopy(currentTrack.currentSection);
    setNotesToCopy(currentTrack.patterns[currentPattern]);
    setCopyType('section');
    setIsPasting(true);
  }, [currentTrack]);

  const onPasteShortcut = useCallback(() => {
    ipcRenderer.send('midihang', {trackz:currentTrack});
    notesHaveChanged(false);

    if (copyType === 'pattern') {
      dispatch(overwriteTrackPattern(notesToCopy, currentPattern));
    } else {
      dispatch(
        overwriteTrackNotes(
          notesToCopy[sectionToCopy],
          currentTrack.currentSection
        )
      );
    }

    setIsPasting(false);
  }, [sectionToCopy, currentTrack]);

  const onShiftDelShortcut = useCallback(() => {
    notesHaveChanged(false);
    clearSection();
  }, []);

  const onDelShortcut = useCallback(() => {
    notesHaveChanged(false);
    clearSectionMeasure();
  }, []);

  const onSpaceShortcut = useCallback(() => {
    toggleIsPlaying();
  }, []);

  const onShiftSpaceShortcut = useCallback(() => {
    toggleIsPlaying();
  }, []);



  useEffect(() => {


    Mousetrap.bind('mod+c', onCopyShortcut);
    Mousetrap.bind('mod+shift+c', onCopyPatternShortcut);
    Mousetrap.bind('mod+v', onPasteShortcut);
    Mousetrap.bind('del', onDelShortcut);
    Mousetrap.bind('shift+del', onShiftDelShortcut);
    Mousetrap.bind('space', onSpaceShortcut);
    Mousetrap.bind('shift+space', onShiftSpaceShortcut);

    Mousetrap.bind('1', () => setTabMute(0));
    Mousetrap.bind('2', () => setTabMute(1));
    Mousetrap.bind('3', () => setTabMute(2));
    Mousetrap.bind('4', () => setTabMute(3));
    Mousetrap.bind('5', () => setTabMute(4));
    Mousetrap.bind('6', () => setTabMute(5));
    Mousetrap.bind('7', () => setTabMute(6));
    Mousetrap.bind('8', () => setTabMute(7));
    Mousetrap.bind('9', () => setTabMute(8));
    Mousetrap.bind('0', () => setTabMute(9));

    Mousetrap.bind('mod+1', () => selectTab(0));
    Mousetrap.bind('mod+2', () => selectTab(1));
    Mousetrap.bind('mod+3', () => selectTab(2));
    Mousetrap.bind('mod+4', () => selectTab(3));
    Mousetrap.bind('mod+5', () => selectTab(4));
    Mousetrap.bind('mod+6', () => selectTab(5));
    Mousetrap.bind('mod+7', () => selectTab(6));
    Mousetrap.bind('mod+8', () => selectTab(7));
    Mousetrap.bind('mod+9', () => selectTab(8));
    Mousetrap.bind('mod+0', () => selectTab(9));

    return () => {};
  }, [sectionToCopy, currentTrack]);

  useEffect(() => {
    ipcRenderer.send('stateStatusUpdate', {
      currentStateIsSaved,
    });
  }, [currentStateIsSaved]);

  useEffect(() => {
    ipcRenderer.on('fileSaved', ({ filePath }) => {
      dispatch(saveTracks(filePath));
    });
    ipcRenderer.on('savePlayingNotes',(evt,{trackName, playingNotes})=>{
      //console.log("Playing Notes " + playingNotes)
      dispatch(changePlayingNotes(trackName, playingNotes));
      ipcRenderer.send('playingNotesUpdated');
    })


    ipcRenderer.on('tick', tick);
  }, []);

  const sendPanicSignal = () => {
    ipcRenderer.send('panic', tracks);
  };

  const selectTab = useCallback((i: React.SetStateAction<number>) => {
    if(i < numberOfTabs) {
      dispatch(changeTrack(i));
    }
  }, [numberOfTabs]);

  const setTabMute = useCallback((i: React.SetStateAction<number>) => {
    ipcRenderer.send('midihang', { trackz:tracks[i]});
    if(i < numberOfTabs) {
      notesHaveChanged(false);

      dispatch(muteTrack(i));
    }
  }, [numberOfTabs]);

  const setTabLabel = useCallback(
    (i: React.SetStateAction<number>, label: string) => {
      dispatch(updateTrackLabel(i, label));
    },
    []
  );

  const removeTab = useCallback((i: React.SetStateAction<number>) => {
    notesHaveChanged(false);
    dispatch(removeTrack(i));
  }, []);

  const addTab = useCallback(() => {
    dispatch(createTrack());
  }, []);

  const onConfigOpen = () => setIsConfigOpen(!isConfigOpen);
  const onHelpOpen = () => setIsHelpOpen(!isHelpOpen);
//irshad
const handleMouseLeave = (event) => {
  if(event.clientX<0||event.clientY<0||event.clientX>window.innerWidth||event.clientY>window.innerHeight){
     setIsUpdating(false);
     setLastUpdatedCell(false);
  }
 };
 useEffect(() => {
   window.addEventListener('mouseup', handleMouseLeave);
   return () => {
       window.removeEventListener('mouseup', handleMouseLeave);
   };
 }, []);

   const startUpdating = useCallback(


     ({ x, y, event }) => {
       // console.log(x, y);
       let notes = cloneMatrix(currentNotes);
       notes[x][y] = 1 + 6;
       setTemporaryNotes(notes);
       setIsUpdating({ x: event.clientX, cell: { x, y } });
       setLastUpdatedCell({ x, y });
     },
     [isUpdating, lastUpdatedCell, temporaryNotes, currentNotes]
   );

   const debouncedSetTemporaryNotes = useMemo(() => debounce(setTemporaryNotes, 50), [setTemporaryNotes]);


  const onUpdating = useCallback(
    ({ x, y, event }) => {

      setLastUpdatedCell({ x, y });
      if (!isUpdating) return;

      let notes = cloneMatrix(currentNotes);
      let startX = isUpdating.cell.x;

      if (x < startX) {
        for (let i = x; i <= startX; i++) {
          notes[i][y] = 0;
        }
      } else {
        let dx = x - startX;

        if (dx === 0) {
          notes[x][y] = 1 + 6;
        } else {
          notes[startX][y] = mode === TRACK_MODE.BEAT ? 1 + 6 : 4 + 6;
          for (let i = startX + 1; i < x; i++) {
            notes[i][y] = mode === TRACK_MODE.BEAT ? 1 + 6 : 2 + 6;
          }
          notes[x][y] = mode === TRACK_MODE.BEAT ? 1 + 6 : 3 + 6;
        }
      }

      debouncedSetTemporaryNotes(notes);
    },
    [isUpdating, lastUpdatedCell, temporaryNotes, debouncedSetTemporaryNotes]
  );
 //irshad
   const stopUpdating = ({ x, y}) => {
   // debouncedSetTemporaryNotes.flush();
     if (isUpdating && typeof x !== 'undefined' && typeof y !== 'undefined') {
       const startCell = isUpdating.cell;
       const startX = Math.min(startCell.x, lastUpdatedCell.x);
       const finalX = Math.max(startCell.x, lastUpdatedCell.x);

       dispatch(updateTrackNote(startCell, lastUpdatedCell));

       // get new state to send to node
       const newState = store.getState();
       let currentTrack = newState.editor.tracks[selectedTab];
       notesHaveChanged(false, 'note_draw', {
         sx: startX,
         ex: finalX,
         y: lastUpdatedCell.y,
         currentTrack,
         currentPattern
       });
     }
     setIsUpdating(false);
     setLastUpdatedCell(false);
   };

  const onSectionClick = useCallback((i: number) => (event: any) => {

    if (currentTrack.playingMode === PLAYING_MODE.MEASURE) {
      ipcRenderer.send('midihang', {trackz:currentTrack});
      notesHaveChanged(false);

    }

    dispatch(updateSelectedSection(i));
  }, [currentTrack]);



  const clearSectionMeasure = () => {
    ipcRenderer.send('midihang', {trackz:currentTrack});
    notesHaveChanged(false);
    dispatch(clearSectionMeasureNotes());
  };

  const clearSection = () => {
    ipcRenderer.send('midihang', {trackz:currentTrack});
    notesHaveChanged(false);
    dispatch(clearSectionNotes());
  };

  const onChangeScaleType = (v) => {
    for(var j=0;j<tracks.length;j++){
      ipcRenderer.send('midihang', {trackz:tracks[j]});
        }


    if (typeof v === 'string') {
      v = parseInt(v, 10);
    }

    notesHaveChanged(false);
    dispatch(changeScaleType(v));
  };

  const onUpdateRandomThreshold = (v) => {
    dispatch(updateTrackThreshold(v));
  };

  const onSectionCopyPaste = (i: number) => (event: any) => {
    if (isPasting) {
      ipcRenderer.send('midihang', {trackz:currentTrack});
      if (i !== sectionToCopy) {
        notesHaveChanged(false);
        dispatch(overwriteTrackNotes(notesToCopy[sectionToCopy], i));
      } else {
        setIsPasting(false);
      }
    } else {
      setSectionToCopy(i);
      setNotesToCopy(currentTrack.patterns[currentPattern]);
      setCopyType('section');
      setIsPasting(true);
    }
  };

  const onMeasureDrop = (from: number, to: number) => {
    ipcRenderer.send('midihang', {trackz:currentTrack});

    dispatch(
      overwriteTrackNotes(
        currentTrack.patterns[currentPattern][from],
        to
      )
    );
  };

  const setIsPattern = (pat) => {
    ipcRenderer.send('midihang', { trackz:currentTrack});
    notesHaveChanged(false);
    dispatch(
      changePlayingMode(
        !currentTrack.playingMode ? PLAYING_MODE.MEASURE : PLAYING_MODE.PATTERN
      )
    );
  };

  const transposeSectionUp = (i) => {

    for(var j=0;j<tracks.length;j++){
      ipcRenderer.send('midihangtrans', {trackz: tracks[j] , transindex:i });
      }

    if (transpositions[i] < 7) {
     // notesHaveChanged(false);
      dispatch(updateTransposition(i, transpositions[i] + 1));
    }
  };

  const transposeSectionDown = (i) => {
    for(var j=0;j<tracks.length;j++){
    ipcRenderer.send('midihangtrans', {trackz: tracks[j] , transindex:i });
    }
    if (transpositions[i] > -7) {
     // notesHaveChanged(false);
      dispatch(updateTransposition(i, transpositions[i] - 1));
    }
  };

  const changePatternUp = () => {
    for(var j=0;j<tracks.length;j++){
  ipcRenderer.send('midihang', {trackz:tracks[j]});
    }
    if (currentPattern < 3) {
      notesHaveChanged(false);
      dispatch(updateSelectedPattern(currentPattern + 1));
    }
  };

  const changePatternDown = () => {
    for(var j=0;j<tracks.length;j++){
      ipcRenderer.send('midihang', {trackz:tracks[j]});
        }
    if (currentPattern > 0) {
      notesHaveChanged(false);
      dispatch(updateSelectedPattern(currentPattern - 1));
    }
  };

  const onSelectKey = (v) => {
    if (typeof v === 'string') {
      v = parseInt(v, 10);
    }

    notesHaveChanged(false);
    dispatch(changeKey(v));
  };

  const menu = (
    <EditorMenu
      swing={swing}
      changeSwingOnTone={changeSwingOnTone}
      tempo={tempo}
      changeTempoOnTone={changeTempoOnTone}
      toggleIsPlaying={toggleIsPlaying}
      isPlaying={isPlaying}
      sendPanicSignal={sendPanicSignal}
      onConfigOpen={onConfigOpen}
      onHelpOpen={onHelpOpen}
    />
  );

  const navbar = (
    <EditorNavbar
    tabs={tracks.map(track => ({
      ...track,
      isBlink: track.playingnotes.some(note => note !== 0) && track.isMuted == 0 ? 1 : 0
    }))}
      selectedTab={selectedTab}
      selectTab={selectTab}
      setIsMute={setTabMute}
      setLabel={setTabLabel}
      removeTab={removeTab}
      isPlaying={isPlaying}
      canAddTab={numberOfTabs < MAX_TABS}
      addTab={addTab}
      menu={menu}
    />
  );

  return (
    <EditorTemplate
      color={currentTrack.color}
      navbar={navbar}
      main={
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <React.Profiler id="StepSequencer" onRender={onRender}>
          <StepSequencer
            highlighted={
              //irshad
              currentTrack.playingMode === PLAYING_MODE.PATTERN
                ? Math.floor(lastPlayedCol / 16) === currentTrack.currentSection
                  ? lastPlayedCol % 16
                  : -1
                : lastPlayedCol % 16
            }
            onMove={onUpdating}
            matrix={currentMatrix}
            color={currentTrack.color}
            isPlaying={isPlaying}
            subDivisions={subDivisions}
            startUpdating={startUpdating}
            stopUpdating={stopUpdating}
            startCell={isUpdating && isUpdating.cell}
            finalCell={lastUpdatedCell}
          />
          </React.Profiler>
          <HelpModal
            isOpen={isHelpOpen}
            closeModal={() => setIsHelpOpen(false)}
            onRequestClose={() => setIsHelpOpen(false)}
          />
          <Modal
            isOpen={isConfigOpen}
            closeModal={() => setIsConfigOpen(false)}
            onRequestClose={() => setIsConfigOpen(false)}
          >
            <div
              style={{
                gridArea: 'left',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <label> Beat scale: </label>
              {new Array(15).fill(0).map((a, i) => (
                <label style={{ marginTop: 2 }}>
                  {(i + 1).toString().padStart(2, '0')}:{' '}
                  <TextInput
                    pattern="\d{0,3}"
                    onChange={onChangeBeatScale(i)}
                    value={beatScale[i]}
                  />
                </label>
              ))}
            </div>
            <div
              style={{
                gridArea: 'right',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <label> Key Note: </label>
              <Select
                options={keyOptions}
                selected={masterKey}
                onSelectChange={onSelectKey}
                inverse
                showEmpty={false}
              />
              <label> Scale Type: </label>
              <Select
                options={scaleOptions}
                selected={masterScaleType}
                onSelectChange={onChangeScaleType}
                inverse
                showEmpty={false}
              />
              MIDI CLOCK OUT:
              <Switch
        isActive={clockSwitchState}
        setIsActive={toggleClockSwitch} // Use the handler prop
        on="Off"
        off="On"
      />
              <div style={{ display: 'flex' }}>
                <Button inverse onClick={loadTracksFromFile}>
                  Load
                </Button>
                <Button inverse onClick={saveTracksToFile}>
                  Save
                </Button>
              </div>

            </div>
          </Modal>
        </div>
      }
      controls={
        <Controls
          color={currentTrack.color}
          octave={octave}
          setOctave={setOctave}
          isPattern={currentTrack.playingMode === PLAYING_MODE.PATTERN}
          setIsPattern={setIsPattern}
          channel={channel}
          setChannel={setChannel}
          setMode={setMode}
          mode={currentTrack.mode}
          rows={currentTrack.rows}
          setRows={setRows}
          inverse
          randomThreshold={currentTrack.randomThreshold}
          setRandomThreshold={onUpdateRandomThreshold}
        />
      }
      preview={
        <Preview
          onDrop={onMeasureDrop}
          transpose={transpositions.map((i) => i + 7)}
          isPasting={isPasting && sectionToCopy.toString()}
          clearSection={clearSectionMeasure}
          onCopyPaste={onSectionCopyPaste}
          onTransposeUp={transposeSectionUp}
          onTransposeDown={transposeSectionDown}
          pattern={[
            currentTrack.patterns[currentPattern][0].notes,
            currentTrack.patterns[currentPattern][1].notes,
            currentTrack.patterns[currentPattern][2].notes,
            currentTrack.patterns[currentPattern][3].notes,
          ]}
          highlighted={
            currentTrack.playingMode === PLAYING_MODE.PATTERN
              ? lastPlayedCol
              : (lastPlayedCol % 16) + currentTrack.currentSection * 16
          }
          transposer={Math.floor(lastPlayedCol / 16)}
          isPlaying={isPlaying}
          color={currentTrack.color}
          currentPattern={currentPattern}
          currentSection={currentTrack.currentSection}
          onSectionClick={onSectionClick}
          patternUp={changePatternUp}
          patternDown={changePatternDown}
        />
      }
    />
  );
}

const EditorMenu = ({
  swing,
  changeSwingOnTone,
  tempo,
  changeTempoOnTone,
  toggleIsPlaying,
  isPlaying,
  sendPanicSignal,
  onConfigOpen,
  onHelpOpen,
}) => (
  <Menu>
  {/* swingwashere */}
    <Label> Tempo: </Label>
    <RangeInput
      value={tempo}
      onChange={changeTempoOnTone}
      min={10}
      max={360}
      step={1}
      inverse
    />
    <Button inverse onClick={toggleIsPlaying} style={{ marginLeft: '10px' }}>
      <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
    </Button>
    <Button inverse onClick={sendPanicSignal} style={{ marginLeft: '10px' }}>
      <FontAwesomeIcon icon={faExclamation} />
    </Button>
    <Button inverse onClick={onConfigOpen} style={{ marginLeft: '10px' }}>
      <FontAwesomeIcon icon={faCog} />
    </Button>
    <Button inverse onClick={onHelpOpen} style={{ marginLeft: '10px' }}>
      <FontAwesomeIcon icon={faQuestion} />
    </Button>
  </Menu>
);
