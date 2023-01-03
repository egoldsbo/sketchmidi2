export const CHANGE_PLAYING_NOTES = 'CHANGE_PLAYING_NOTES';
export const CHANGE_OCTAVE = 'CHANGE_OCTAVE';
export const CHANGE_CHANNEL = 'CHANGE_CHANNEL';
export const CHANGE_TEMPO = 'CHANGE_TEMPO';
export const CHANGE_SWING = 'CHANGE_SWING';
export const CHANGE_ROWS = 'CHANGE_ROWS';
export const OVERWRITE_TRACK_NOTES = 'OVERWRITE_TRACK_NOTES';
export const OVERWRITE_TRACK_PATTERN= 'OVERWRITE_TRACK_PATTERN';
export const CLEAR_MEASURE_NOTES = 'CLEAR_MEASURE_NOTES';
export const CLEAR_SECTION_NOTES = 'CLEAR_SECTION_NOTES';
export const UPDATE_TRACK_NOTE = 'UPDATE_TRACK_NOTE';
export const UPDATE_TRANSPOSITION = 'UPDATE_TRANSPOSITION';
export const CHANGE_TRACKS = 'CHANGE_TRACKS';
export const CREATE_TRACK = 'CREATE_TRACK';
export const REMOVE_TRACK = 'REMOVE_TRACK';
export const MUTE_TRACK = 'MUTE_TRACK';
export const UPDATE_TRACK_LABEL = 'UPDATE_TRACK_LABEL';
export const UPDATE_TRACK_THRESHOLD = 'UPDATE_TRACK_THRESHOLD';
export const UPDATE_SELECTED_PATTERN = 'UPDATE_SELECTED_PATTERN';
export const UPDATE_SELECTED_SECTION = 'UPDATE_SELECTED_SECTION';
export const LOAD_TRACKS = 'LOAD_TRACKS';
export const SAVE_TRACKS = 'SAVE_TRACKS';
export const CHANGE_MODE = 'CHANGE_MODE';
export const CHANGE_PLAYING_MODE = 'CHANGE_PLAYING_MODE';

export const CHANGE_KEY = "CHANGE_KEY";
export const CHANGE_SCALE_TYPE = "CHANGE_SCALE_TYPE";
export const CHANGE_BEAT_SCALE = "CHANGE_BEAT_SCALE";

export const changeKey = (key: number) => ({
  type: CHANGE_KEY,
  key
});

export const changeScaleType = (scaleType: number) => ({
  type: CHANGE_SCALE_TYPE,
  scaleType
});

export const changeBeatScale = (i: number, beat: number) => ({
  type: CHANGE_BEAT_SCALE,
  i,
  beat
});

export const changeOctave = (newOctave: number) => ({
  type: CHANGE_OCTAVE,
  octave: newOctave,
});

export const changePlayingNotes = (notes: number[]) => ({
  type: CHANGE_PLAYING_NOTES,
  playingNotes: notes,
});


export const changeRows = (newRows: number) => ({
  type: CHANGE_ROWS,
  rows: newRows,
});

export const changeTempo = (newTempo: number) => ({
  type: CHANGE_TEMPO,
  tempo: newTempo,
});

export const changeSwing = (newSwing: number) => ({
  type: CHANGE_SWING,
  swing: newSwing,
});

export const changeChannel = (newChannel: string) => ({
  type: CHANGE_CHANNEL,
  channel: parseInt(newChannel, 10),
});

export const changeTrack = (newActiveTrack: number) => ({
  type: CHANGE_TRACKS,
  activeTrack: newActiveTrack,
});

export const muteTrack = (track: number) => ({
  type: MUTE_TRACK,
  track,
});

export const updateTrackLabel = (track: number, label: string) => ({
  type: UPDATE_TRACK_LABEL,
  track,
  label
});

export const updateTrackThreshold = ( randomThreshold: number) => ({
  type: UPDATE_TRACK_THRESHOLD,
  randomThreshold
});

export const overwriteTrackPattern = (sections: number[], pattern: number) => ({
  type: OVERWRITE_TRACK_PATTERN,
  sections,
  pattern,
});


export const overwriteTrackNotes = (newNotes: number[][], section: number) => ({
  type: OVERWRITE_TRACK_NOTES,
  notes: newNotes,
  section,
});

export const clearSectionNotes = (section: number) => ({
  type: CLEAR_SECTION_NOTES,
  section,
});

export const clearSectionMeasureNotes = (section: number) => ({
  type: CLEAR_MEASURE_NOTES,
  section,
});

interface Cell {
  x:number;
  y:number;
}

export const updateTrackNote = (startCell: Cell, finalCell: Cell) => ({
  type: UPDATE_TRACK_NOTE,
  startCell,
  finalCell
});

export const updateTransposition = (t: number, transposition: number) => ({
  type: UPDATE_TRANSPOSITION,
  t,
  transposition
});

export const createTrack = (newTrack) => ({
  type: CREATE_TRACK,
  track: newTrack,
});

export const removeTrack = (track) => ({
  type: REMOVE_TRACK,
  track,
});

export const updateSelectedPattern = (pattern) => ({
  type: UPDATE_SELECTED_PATTERN,
  pattern,
});

export const updateSelectedSection = (section) => ({
  type: UPDATE_SELECTED_SECTION,
  section,
});

export const loadTracks = ({ state: editorState, filePath }) => ({
  type: LOAD_TRACKS,
  editorState,
  filePath,
});

export const saveTracks = () => ({
  type: SAVE_TRACKS,
});

export const changeMode = (newMode: string) => ({
  type: CHANGE_MODE,
  mode: newMode,
});

export const changePlayingMode = (newMode: string) => ({
  type: CHANGE_PLAYING_MODE,
  mode: newMode,
});
