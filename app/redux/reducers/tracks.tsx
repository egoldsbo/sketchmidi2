import {
  CHANGE_CHANNEL,
  CHANGE_KEY,
  CHANGE_MODE,
  CHANGE_OCTAVE,
  CHANGE_PLAYING_NOTES,
  CHANGE_ROWS,
  CHANGE_PLAYING_MODE,
  CHANGE_SCALE_TYPE,
  CHANGE_BEAT_SCALE,
  CHANGE_SWING,
  CHANGE_TEMPO,
  CHANGE_TRACKS,
  CREATE_TRACK,
  REMOVE_TRACK,
  LOAD_TRACKS,
  MUTE_TRACK,
  UPDATE_TRACK_LABEL,
  OVERWRITE_TRACK_NOTES,
  OVERWRITE_TRACK_PATTERN,
  CLEAR_MEASURE_NOTES,
  CLEAR_SECTION_NOTES,
  SAVE_TRACKS,
  UPDATE_TRANSPOSITION,
  UPDATE_SELECTED_PATTERN,
  UPDATE_SELECTED_SECTION,
  UPDATE_TRACK_NOTE,
  UPDATE_TRACK_THRESHOLD,
} from '../actions';

import { PLAYING_MODE, TRACK_MODE } from '../../constants/modes';

function convertNotesToMono(notes) {
  let newNotes = cloneMatrix(notes);

  for (let i = 0; i < notes.length; i++) {
    let last;
    for (let j = notes[0].length - 1; j >= 0; j--) {
      if (newNotes[i][j] > 0) {
        last = j;
        break;
      }
    }

    if (last) {
      newNotes[i] = new Array(notes[0].length).fill(0);
      newNotes[i][last] = notes[i][last];
    }
  }

  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < notes[0].length; j++) {
      let pre = 0;
      if (i > 0) {
        pre = newNotes[i - 1][j];
      }
      let cur = newNotes[i][j];

      let pos = 0;
      if (i < COLUMNS - 1) {
        pos = newNotes[i + 1][j];
      }

      switch (true) {
        case pre === 0 && cur > 1 && pos === 0:
          newNotes[i][j] = 1;
          break;
        case pre === 0 && cur === 2 && pos > 1:
          newNotes[i][j] = 4;
          break;
        case pre > 1 && cur === 2 && pos === 0:
          newNotes[i][j] = 3;
          break;
      }
    }
  }

  return newNotes;
}

function convertToMono(patterns) {
  return patterns.map((pattern) => {
    return pattern.map((measure) => {
      return { ...measure, notes: convertNotesToMono(measure.notes) };
    });
  });
}

function convertNotesToBeat(notes) {
  let newNotes = cloneMatrix(notes);

  for (let i = 0; i < notes.length; i++) {
    for (let j = notes[0].length - 1; j >= 0; j--) {
      if (newNotes[i][j] > 0) {
        newNotes[i][j] = 1;
      }
    }
  }

  return newNotes;
}

function convertToBeat(patterns) {
  return patterns.map((pattern) => {
    return pattern.map((measure) => {
      return { ...measure, notes: convertNotesToBeat(measure.notes) };
    });
  });
}

const generateTrack = (columns: number, rows: number) => {
  return [
    [
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
    ],
    [
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
    ],
    [
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
    ],
    [
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
      Measure(columns, rows),
    ],
  ];
};

export const generateMatrix = (width: number, height: number) => {
  return new Array(width).fill(0).map(() => {
    return new Array(height).fill(0);
  });
};

export const cloneMatrix = (oldMatrix: Array) => {
  return new Array(oldMatrix.length).fill(0).map((v, i) => [...oldMatrix[i]]);
};

function Measure(rows: number, columns: number) {
  return {
    rows: rows,
    columns: columns,
    notes: generateMatrix(rows, columns),
  };
}

const COLUMNS = 16;
const ROWS = 8;

const initialTrackReducer = {
  // TODO: move this to separate reducer
  changesWereSaved: true,
  activeTrack: 0,

  // TODO: make this per track only
  rows: ROWS,
  columns: COLUMNS,

  filePath: '',
  tempo: 120,
  swing: 0,
  scaleType: 0,
  beatScale: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
  key: 0,
  currentPattern: 0,
  transpositions: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  tracks: [
    {
      playingMode: PLAYING_MODE.MEASURE,
      name: '1',
      color: `hsl(${Math.random() * 360}, 100%, 75%)`,
      currentSection: 0,
      octave: 5,
      channel: 0,
      instrument: false,
      instrumentPath: '',
      mode: TRACK_MODE.POLY,
      isMuted: false,
      randomThreshold: 100,
      muteflag:false,
      octaveflag:false,
      channelflag:false,
      lastchannel:0,
      playingnotes:[],
      rows: ROWS,
      columns: COLUMNS,


      patterns: generateTrack(COLUMNS, ROWS),
    },
  ],
};

export function editorReducer(state = initialTrackReducer, action: any) {
  let updatedTracks;
  let updatedPatterns;

  switch (action.type) {
    case SAVE_TRACKS:
      return { ...state, filePath: action.filePath, changesWereSaved: true };

    case LOAD_TRACKS:
      return {
        ...action.editorState,
        filePath: action.filePath,
        changesWereSaved: true,
      };
    case CHANGE_TRACKS:
      return {
        ...state,
        activeTrack: action.activeTrack,
        changesWereSaved: false,
      };

    case CHANGE_KEY:
      return { ...state, key: action.key, changesWereSaved: false };
    case CHANGE_SCALE_TYPE:
      return { ...state, scaleType: action.scaleType, changesWereSaved: false };
    case CHANGE_BEAT_SCALE:
      return {
        ...state,
        beatScale: state.beatScale.map((beat, i) =>
          i === action.i ? action.beat : beat
        ),
        changesWereSaved: false,
      };
    case CHANGE_SWING:
      return { ...state, swing: action.swing, changesWereSaved: false };
    case CHANGE_TEMPO:
      return { ...state, tempo: action.tempo, changesWereSaved: false };

    case UPDATE_TRANSPOSITION:
      return {
        ...state,
        changesWereSaved: false,
        transpositions: state.transpositions.map((t, i) => {
          if (i !== state.currentPattern) {
            return t;
          }

          return t.map((t, i) => {
            if (i !== action.t) {
              return t;
            }

            return action.transposition;
          });
        }),
      };

    case MUTE_TRACK:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== action.track) {
          return track;
        }

        return {
          ...track,
          isMuted: !track.isMuted,
          muteflag: !track.muteflag,playingnotes: track.playingnotes,
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case UPDATE_TRACK_LABEL:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== action.track) {
          return track;
        }

        return {
          ...track,
          name: action.label,
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case UPDATE_TRACK_THRESHOLD:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        return {
          ...track,
          randomThreshold: action.randomThreshold,playingnotes: track.playingnotes,
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case CHANGE_PLAYING_MODE:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        return {
          ...track,
          playingMode: action.mode,playingnotes: track.playingnotes,
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };
    case CHANGE_MODE:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        let newPatterns;
        if (action.mode == TRACK_MODE.MONO) {
          newPatterns = convertToMono(track.patterns);
        } else if (action.mode == TRACK_MODE.BEAT) {
          newPatterns = convertToBeat(track.patterns);
        } else {
          newPatterns = track.patterns;
        }

        return {
          ...track,
          mode: parseInt(action.mode),
          patterns: newPatterns,
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case CHANGE_OCTAVE:
      updatedTracks = state.tracks.map((track, i) => {

        console.log("Tracks Playing note ",track.playingnotes);
        if (i !== state.activeTrack) {
          return track;
        }
        console.log("ping :",track);
        return { ...track, octave: action.octave
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false};

      case CHANGE_PLAYING_NOTES:
        updatedTracks = state.tracks.map((track, i) => {

          console.log("Old Playing note ",track.playingnotes);
          console.log("New Playing note ",action);
          if (i !== state.activeTrack) {
            return track;
          }

          let playingNotes = [];
          if(action.playingNotes){
            playingNotes = action.playingNotes;
          }

          return { ...track, playingnotes:playingNotes
          };
        });
        return { ...state, tracks: updatedTracks, changesWereSaved: false};

    case CHANGE_ROWS:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        return {
          ...track,
          rows: action.rows,
          patterns: generateTrack(COLUMNS, action.rows),
        };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case CHANGE_CHANNEL:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }
        return { ...track,playingnotes: track.playingnotes, channel: action.channel,channelflag:!track.channelflag };
      });
      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case OVERWRITE_TRACK_PATTERN:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        updatedPatterns = track.patterns.map((pattern, i) => {
          if (i !== action.pattern) {
            return pattern;
          }

          switch (track.mode) {
            case TRACK_MODE.MONO:
              return convertToMono(action.sections);
            case TRACK_MODE.BEAT:
              return convertToBeat(action.sections);
            default:
              return action.sections;
          }
        });

        return { ...track, playingnotes: track.playingnotes,patterns: updatedPatterns, changesWereSaved: false };
      });

      return { ...state, tracks: updatedTracks };

    case OVERWRITE_TRACK_NOTES:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        updatedPatterns = track.patterns.map((pattern, i) => {
          if (i !== state.currentPattern) {
            return pattern;
          }

          return pattern.map((section, i) => {
            if (i !== action.section) {
              return section;
            }

            // console.log(
            //   track.mode,
            //   TRACK_MODE.BEAT,
            //   track.mode === TRACK_MODE.BEAT
            // );
            switch (track.mode) {
              case TRACK_MODE.MONO:
                return {
                  ...section,
                  notes: convertNotesToMono(action.notes.notes),
                };
              case TRACK_MODE.BEAT:
                return {
                  ...section,
                  notes: convertNotesToBeat(action.notes.notes),
                };
              default:
                return { ...section, notes: action.notes.notes };
            }
          });
        });

        return { ...track, playingnotes: track.playingnotes,patterns: updatedPatterns, changesWereSaved: false };
      });

      return { ...state, tracks: updatedTracks };

    case CLEAR_MEASURE_NOTES:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        updatedPatterns = track.patterns.map((pattern, i) => {
          if (i !== state.currentPattern) {
            return pattern;
          }

          return pattern.map((section, i) => {
            if (i !== track.currentSection) {
              return section;
            }

            return {
              ...section,
              notes: generateMatrix(section.rows, section.columns),
            };
          });
        });

        return { ...track, patterns: updatedPatterns, changesWereSaved: false };
      });

      return { ...state, tracks: updatedTracks };

    case CLEAR_SECTION_NOTES:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        updatedPatterns = track.patterns.map((pattern, i) => {
          if (i !== state.currentPattern) {
            return pattern;
          }

          return pattern.map((section) => {
            return {
              ...section,
              notes: generateMatrix(section.rows, section.columns),
            };
          });
        });

        return { ...track, patterns: updatedPatterns, changesWereSaved: false };
      });

      return { ...state, tracks: updatedTracks };

    case UPDATE_TRACK_NOTE:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        updatedPatterns = track.patterns.map((pattern, i) => {
          if (i !== state.currentPattern) {
            return pattern;
          }

          return pattern.map((section, i) => {
            if (i !== track.currentSection) {
              return section;
            }

            const { x, y } = action.finalCell;
            const { x: ox } = action.startCell;

            // console.log(x, ox, 'y', y);

            let newMatrix = cloneMatrix(section.notes);

            let dx = x - ox;
            if (x < ox) {
              for (let i = x; i <= ox; i++) {
                newMatrix[i][y] = 0;
              }
            } else {
              if (dx === 0) {
                if (newMatrix[x][y] == 1) {
                  newMatrix[x][y] = 0;
                } else {
                  newMatrix[x][y] = 1;
                }
              } else {
                newMatrix[ox][y] = track.mode === TRACK_MODE.BEAT ? 1 : 4;
                for (let i = ox + 1; i < x; i++) {
                  newMatrix[i][y] = track.mode === TRACK_MODE.BEAT ? 1 : 2;
                }
                newMatrix[x][y] = track.mode === TRACK_MODE.BEAT ? 1 : 3;
              }
            }

            let startX = Math.min(ox, x);
            let endX = Math.max(ox, x);

            if (startX - 1 >= 0) {
              switch (newMatrix[startX - 1][y]) {
                case 2:
                  newMatrix[startX - 1][y] = 3;
                  break;
                case 4:
                  newMatrix[startX - 1][y] = 1;
                  break;
              }
            }

            if (endX + 1 < track.columns) {
              switch (newMatrix[endX + 1][y]) {
                case 2:
                  newMatrix[endX + 1][y] = 4;
                  break;
                case 3:
                  newMatrix[endX + 1][y] = 1;
                  break;
              }
            }

            if (track.mode == TRACK_MODE.MONO && dx >= 0) {
              for (let i = 0; i < track.rows; i++) {
                for (let j = ox; j <= x; j++) {
                  if (i === y) continue;
                  newMatrix[j][i] = 0;
                }
                if (ox - 1 >= 0) {
                  switch (newMatrix[ox - 1][i]) {
                    case 2:
                      newMatrix[ox - 1][i] = 3;
                      break;
                    case 4:
                      newMatrix[ox - 1][i] = 1;
                      break;
                  }
                }

                if (x + 1 < track.columns) {
                  switch (newMatrix[x + 1][i]) {
                    case 2:
                      newMatrix[x + 1][i] = 4;
                      break;
                    case 3:
                      newMatrix[x + 1][i] = 1;
                      break;
                  }
                }
              }
            }

            return { ...section, notes: newMatrix };
          });
        });

        return { ...track, patterns: updatedPatterns,playingnotes: track.playingnotes, changesWereSaved: false };
      });

      return { ...state, tracks: updatedTracks, changesWereSaved: false };

    case CREATE_TRACK:
      // let newColor = `#${Math.floor(Math.random() * 255 * 255 * 255)}`;
      let newColor = `hsl(${Math.random() * 360}, 100%, 75%)`;

      return {
        ...state,
        tracks: [
          ...state.tracks,
          {
            name: String(state.tracks.length + 1),
            color: newColor,
            octave: 5,
            mode: TRACK_MODE.POLY,
            channel: state.tracks.length,
            currentSection: 0,
            columns: action.columns || COLUMNS,
            rows: action.rows || ROWS,
            patterns: generateTrack(
              action.columns || COLUMNS,
              action.rows || ROWS
            ),
            playingMode: PLAYING_MODE.MEASURE,
            isMuted: false,
            muteflag:false,
            octaveflag:false,
            channelflag:false,
            lastchannel:0,
            playingnotes:[],
            randomThreshold: 100,
            instrument: false,
            instrumentPath: '',
          },
        ],
        activeTrack: state.tracks.length,
        changesWereSaved: false,
      };

    case REMOVE_TRACK:
      let newTracks = state.tracks.filter((t, i) => i !== action.track);
      return {
        ...state,
        tracks: newTracks,
        activeTrack:
          state.activeTrack >= newTracks.length - 1
            ? newTracks.length - 1
            : state.activeTrack,
        changesWereSaved: false,
      };

    case UPDATE_SELECTED_PATTERN:
      return { ...state, currentPattern: action.pattern, changesWereSaved: false, };

    case UPDATE_SELECTED_SECTION:
      updatedTracks = state.tracks.map((track, i) => {
        if (i !== state.activeTrack) {
          return track;
        }

        return { ...track, playingnotes: track.playingnotes, currentSection: action.section };
      });

      return { ...state,  tracks: updatedTracks, changesWereSaved: false };

    default:
      return state;
  }
}
