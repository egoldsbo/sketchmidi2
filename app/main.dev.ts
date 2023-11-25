/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, session, BrowserWindow, ipcMain, dialog, netLog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import easymidi from 'easymidi';
import MenuBuilder from './menu';
import fs from 'fs';
import { PLAYING_MODE, TRACK_MODE } from './constants/modes';
import clamp from './utils/clamp';
import transpose from './utils/transpose';
import Swinger from './utils/swinger';
import { updateSelectedPattern } from './redux/actions';
import { current } from 'immer';
import { push } from 'connected-react-router';

let lastnotes=new Map();
let didMidiChange = false;
let appState: any = {};
let swinger;
var newtempo = 120;
var newswing = 0;
var newswinglast = 0;
var newtempolast = 120;
var midiClockTicks = -1;
var tracknameindex=[];
var currenttrackname = '1';
var holdplayingnotes = []
const START_TEMPO = 120;
var noteoffflag=[];
var noteoffflagchannel=[];
var currenttrans=0;
var newlyplayednotes=[];
var midiclock=true;

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const {
    default: install,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS
  } = require('electron-devtools-installer');
  const extensions = [REACT_DEVELOPER_TOOLS];

  return Promise.all(
    extensions.map((devTool) =>
      install(devTool, { loadExtensionOptions: { allowFileAccess: true }, forceDownload: false })
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    )
  ).catch(console.log);
};

app.whenReady().then(async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await session.defaultSession.loadExtension("/home/otho/.config/Electron/extensions/fmkadmapgofadopljbjfkapdkoienihi");

    // installExtensions();
  }
});

const createWindow = async () => {
  let stateIsSaved = false;

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
        process.env.ERB_SECURE !== 'true'
        ? {
          nodeIntegration: true,
        }
        : {
          preload: path.join(__dirname, 'dist/renderer.prod.js'),
        },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.on('close', function (e) {
     if (!stateIsSaved) {
       const choice = dialog.showMessageBoxSync(this, {
         type: 'question',
         buttons: ['Yes', 'No'],
         title: 'Unsaved Track',
         message: 'You have unsaved changes. Are you sure you want to quit?',
       });
       if (choice === 1) {
         e.preventDefault();
       }
     }

    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 127; j++) {
        output.send('noteoff', {
          note: j,
          velocity: 0,
          channel: i,
        });


      }
    }

  });
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  const midiCallback =
    (
      evt,
      {

        notes,
        previousNotes,
        column,
        realCol,
        octave,
        key,
        scaleType,
        transpositions,
        channel,
        beatScale,
        playingMode,
        randomThreshold,
        trackplayingnotes,
      }
    ) => {


      var eventempo = newtempo + (newtempo * newswing / 2);
      var oddtempo = newtempo - (newtempo * newswing / 2);

      if (column % 2 == 0) { swinger.setTempo(eventempo); }
      if (column % 2 == 1) { swinger.setTempo(oddtempo); }
      newswinglast = newswing;
      newtempolast = newtempo;




      if (didMidiChange) {
        didMidiChange = false;
        return trackplayingnotes;
      }
      let lastI = notes.length - 1;
      notes.forEach((note, i) => {

        const previousNote = previousNotes[i];
        const newMeasure = realCol % 16 === 0;

        if (previousNote === 0 && note === 0) {
          return trackplayingnotes;
        }

        let previousRealcol = realCol - 1;
        if (previousRealcol < 0) {
          previousRealcol = 63;
        }

        let transposition = transpositions[Math.floor(realCol / 16)];
        let pastTransposition = transpositions[Math.floor(previousRealcol / 16)];
        let midiNote;
        let previousMidiNote;

        if (playingMode !== TRACK_MODE.BEAT) {
          midiNote = clamp(transpose(
            octave * 12,
            transposition + scaleType + (lastI - i)
          ) + key, 0, 127);
          previousMidiNote = clamp(transpose(
            octave * 12,
            pastTransposition + scaleType + (lastI - i)
          ) + key, 0, 127);
        } else {
          midiNote = beatScale[lastI - i];
          previousMidiNote = beatScale[lastI - i];
        }

        // console.log(realCol, newMeasure);
        if (((((previousNote && (note === 0 || note === 1)) || newMeasure)) || (previousNote === 3 || previousNote === 1) && note === 4) && note_map[channel][previousMidiNote]) {
          output.send('noteoff', {
            note: previousMidiNote,
            velocity: 0,
            channel,
          });

          trackplayingnotes[i] = 0;
          note_map[channel][previousMidiNote] = false;

        }

        if ((note === 1 || note === 4) && !note_map[channel][midiNote]) {
          let rand = Math.random() * 100;
          if (rand < randomThreshold) {
            output.send('noteon', {
              note: midiNote,
              velocity: 127,
              channel,
            });
            newlyplayednotes.push(midiNote);
            trackplayingnotes[i] = midiNote;
            note_map[channel][midiNote] = true;
          }
        }
      });


      return trackplayingnotes;

    }

  let counter = 0;
  const midiTimerCallback = () => {

    midiClockTicks++;
    if(midiclock==true){
    output.send('clock');

    }
    midiClockTicks = midiClockTicks % 6;
    if (midiClockTicks == 0) {

      const col = counter;
      mainWindow.webContents.send('tick', { col: counter });

      const editor: any = appState.editor;
      const { tracks, beatScale, transpositions: allTranspositions, key: masterKey, scaleType: masterScaleType, currentPattern } = editor;

      const transpositions = allTranspositions[currentPattern];
     currenttrans=Math.floor((counter) / 16);

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

          //track.pattern.cell[section]][x][y]
          //track.patterns[pattern][section].notes;
        }
        const noteCol =
          track.playingMode === PLAYING_MODE.PATTERN ? col : col % 16;




        if (!track.isMuted) {

          //console.log("before playingNotes ",track.playingnotes);

          track.playingnotes =
            midiCallback({}, {
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
              randomThreshold: track.randomThreshold,
              trackplayingnotes: track.playingnotes,

            });


/*irshad
            if(track.playingnotes.length==0){
              //blinktracklabelon
            } else{
              //blinktracklabeloff
            }
*/

//add newly played notes to currentlyplayingnotesarray

            if(lastnotes.has(track.name)==false){
                lastnotes.set(track.name,[]);
            }
            var somethingarray =lastnotes.get(track.name);
            for(var i=0;i<newlyplayednotes.length;i++){
                if(somethingarray.includes(newlyplayednotes[i])==false){
                    somethingarray.push(newlyplayednotes[i]);
                }
            }

            lastnotes.set(track.name,somethingarray);
            newlyplayednotes=[];

        }
        mainWindow.webContents.send('savePlayingNotes', { trackName:track.name, playingNotes:track.playingnotes});
        console.log(track.name,track.playingnotes);

      });

      counter++;
      counter = counter % 64;
    }
  }

  ipcMain.on('swingChange', (evt, { swing }) => {


    newswing = swing;
  });

  //tracks[1].sections[A].patterns[2].cell[0][0]
  swinger = new Swinger(midiTimerCallback, START_TEMPO, 0);

  const outputName = 'SketchMIDI'.toLowerCase();

  let output;

  var deviceNotFound = true;



    let allOutputs = easymidi.getOutputs();
    allOutputs.some((name) => {
      let deviceName = name.toLowerCase();
      if (deviceName.indexOf(outputName) > -1) {

        deviceNotFound = false;
        console.log("We have found our device");
        return (output = new easymidi.Output(name));

      }
    });
    if (deviceNotFound == true){
    output = new easymidi.Output(outputName, true);
    deviceNotFound = false;
    console.log("We created a port named",outputName);
  }

  if (deviceNotFound == true) {
    console.log("No Device found");
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'No MIDI Device Found',
      message: 'No MIDI port named sketchMIDI was found and a virtual MIDI device could not be created. sketchMIDI will not function without a MIDI outlet. if using windows,it is reccomended to install the program "loopMIDI" and create a virtual MIDI device called SketchMIDI (case sensitive). https://www.tobias-erichsen.de/software/loopmidi.html'
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (output) {
      output.close();
    }
  });

  ipcMain.on('play', () => {
    counter = 0;
    if(midiclock==true){
    output.send('start');}
    swinger.start();
  });

  ipcMain.on('stop', () => {
    counter = 0;
    if(midiclock==true){
    output.send('stop');}
    midiClockTicks = -1;
    swinger.stop();


  ipcMain.on('currenttrackname', (evt, { currenttrackName }) => {
    currenttrackname = currenttrackName;
    //console.log(currenttrackname);
  });




  ipcMain.on('midihang', (evt, { trackz }) => {
var notestooff=lastnotes.get(trackz.name);
console.log("midihang",trackz,notestooff);

  for(var i=0;i<notestooff.length;i++){
     output.send('noteoff', {
      note: notestooff[i],
      velocity: 0,
      channel: trackz.channel,
  });
lastnotes.set(trackz.name,[]);
  }
  trackz.playingnotes=[];
  mainWindow.webContents.send('savePlayingNotes', { trackName:trackz.name, playingNotes:trackz.playingnotes});
  });


  ipcMain.on('midihangtrans', (evt, { trackz,transindex }) => {
    if(transindex==currenttrans){
    var notestooff=lastnotes.get(trackz.name);
    console.log("midihang",trackz,notestooff);

      for(var i=0;i<notestooff.length;i++){
         output.send('noteoff', {
          note: notestooff[i],
          velocity: 0,
          channel: trackz.channel,
      });
    lastnotes.set(trackz.name,[]);
      }
      trackz.playingnotes=[];
      mainWindow.webContents.send('savePlayingNotes', { trackName:trackz.name, playingNotes:trackz.playingnotes});
    }
      });

      ipcMain.on('tempoChange', (evt, { tempo }) => {
    newtempo = tempo;
    console.log("tempo",newtempo);
  });

  ipcMain.on('poster', (evt, { post }) => {
   console.log("poster",post);
  });

  ipcMain.on('toggleMidiClock', (evt) => {
    console.log("togglemidiclock");
    if(midiclock==true){
      midiclock=false;
    }
    else{
      midiclock=true;
    }
   });

  const note_map = [];
  for (let i = 0; i < 16; i++) {
    note_map.push([]);
    for (let j = 0; j < 128; j++) {
      note_map[i].push(false);
    }
  }

  ipcMain.on('state', (evt, { fullState }) => {

    appState = fullState;
  });

  ipcMain.on(
    'note_draw',
    (
      evt,
      {

        notes,
        previousNotes,
        column,
        realCol,
        octave,
        key,
        scaleType,
        transpositions,
        channel,
        beatScale,
        playingMode,
        turnOn,
        extra,
      }
    ) => {
      let lastI = notes.length - 1;
      const { sx, ex, y, currentTrack, currentPattern } = extra;

      const pattern = currentTrack.patterns[currentPattern];
      const section = pattern[currentTrack.currentSection].notes;


      let midiNote;
      let transposition = transpositions[Math.floor(realCol / 16)];
      for (let i = sx; i <= ex; i++) {
        if (section[i][y] == 0) {
          console.log(octave, transposition, scaleType, lastI - y, key);
          midiNote = clamp(transpose(
            octave * 12,
            transposition + scaleType + (lastI - y)
          ) + key, 0, 127);

          output.send('noteoff', {
            note: midiNote,
            velocity: 127,
            channel,
          });

          // console.log(note_map[channel], midiNote);
          note_map[channel][midiNote] = false;
        }
      }
    }
  );

  ipcMain.on(
    'midi_change',
    (
      evt,
      {
        notes,
        previousNotes,
        column,
        realCol,
        octave,
        key,
        scaleType,
        transpositions,
        channel,
        beatScale,
        playingMode,
        turnOn,
        currenttrack,
      }
    ) => {
      let lastI = notes.length - 1;
      //didMidiChange = true;

      notes.forEach((note, i) => {
        const previousNote = previousNotes[i];

        let transposition = transpositions[Math.floor(realCol / 16)];
        let previousTransposition =
          transpositions[
          Math.floor((realCol - 1 >= 0 ? realCol - 1 : 63) / 16)
          ];
        let midiNote;
        let previousMidiNote;

        if (playingMode !== TRACK_MODE.BEAT) {
          midiNote = clamp(transpose(
            octave * 12,
            transposition + scaleType + (lastI - i)
          ) + key, 0, 127);
          previousMidiNote = clamp(transpose(
            octave * 12,
            transposition + scaleType + (lastI - i)
          ) + key, 0, 127);
        } else {
          midiNote = beatScale[lastI - i];
          previousMidiNote = beatScale[lastI - i];
        }

        note_map[channel][midiNote] = false;

      });
    }
  );

  ipcMain.on(
    'midi',
    midiCallback
  );



  ipcMain.on('panic', (evt, tracks) => {
    // console.log(note_map.flat(3).filter(e => e).length);
    note_map.forEach((channel, c) => {
      channel.forEach((note, n) => {
        if (note) {
          output.send('noteoff', {
            note: n,
            velocity: 0,
            channel: c,
          });
        }

        note_map[c][n] = false;
      });
    });
    tracks.forEach((track) => {
      output.send('cc', {
        controller: 123,
        value: 0,
        channel: track.channel,
      });
    });
  });

  ipcMain.on('saveTracksToFile', (evt, { state }) => {
    let options = {
      title: 'Save eMidi file',

      defaultPath: state.filePath || 'newSong.json',

      //Placeholder 4
      buttonLabel: 'Save',

      //Placeholder 3
      filters: [{ name: 'eMidi', extensions: ['json'] }],
    };
    dialog.showSaveDialog(mainWindow, options).then(({ filePath }) => {
      const toSave = { ...state };
      delete toSave.filePath;

      fs.writeFile(filePath, JSON.stringify(toSave), 'utf8', () =>
        console.log(`Created ${filePath}`)
      );
      ipcMain.send('fileSaved', { filePath });
    });
  });

  ipcMain.on('changeMode', (evt, { mode, newMode }) => {
    const choice = dialog.showMessageBox(this, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Change Mode',
      message: `You are trying to change the mode from ${mode} to ${newMode}. This will erase all notes on this track. Are you sure you want to proceed?`,
    });

    evt.returnValue = choice !== 1;

  });

  ipcMain.on('changeRows', (evt, { rows, newRows }) => {
    const choice = dialog.showMessageBoxSync(this, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Change Rows',
      message: `You are trying to change the number of rows from ${rows} to ${newRows}. This will erase all notes on this track. Are you sure you want to proceed?`,
    });

    evt.returnValue = choice !== 1;
  });




  ipcMain.on('loadTracksFromFile', (evt, { filePath }) => {
    let options = {
      title: 'Load eMidi file',

      defaultPath: path.dirname(filePath) || '',

      buttonLabel: 'Load',

      filters: [{ name: 'eMidi', extensions: ['json'] }],
    };
    dialog.showOpenDialog(mainWindow, options).then(({ filePaths }) => {
      if (filePaths.length === 0) {
        return;
      }
      const filePath = filePaths[0];
      const tracksState = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      evt.returnValue = { state: tracksState, filePath };
    });
  });
  ipcMain.on('stateStatusUpdate', (evt, { currentStateIsSaved }) => {
    stateIsSaved = currentStateIsSaved;
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
