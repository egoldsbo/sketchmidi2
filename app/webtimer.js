const {performance} = require('perf_hooks');
const { parentPort } = require('worker_threads');
var bpm = 120.0;
var midiclockcount=0;
var intervalTime = (60000.0/bpm)/24.0; // Interval time in milliseconds
var timelast = performance.now();
var isRunning = false;

function checkTimeAndSendTick() {
  if (!isRunning) {
    return; // Exit the function if the timer is not running
  }
  const timeNow = performance.now();
  if (timeNow - timelast >= intervalTime) {
    timelast = timeNow;
    parentPort.postMessage('clocktick');
    midiclockcount++;
    midiclockcount=midiclockcount%12;
    if(midiclockcount==0){
      parentPort.postMessage('notetick');
    }
  }
  setImmediate(checkTimeAndSendTick);
}

parentPort.on('message', (message) => {
  if (message === 'start') {
    timelast=performance.now();
    isRunning = true;
    checkTimeAndSendTick();
  }

  if (message === 'stop') {
    isRunning = false;
    midiclockcount=0;
  }

  if (message.type === 'setBpm') {
    bpm = parseFloat(message.value);
    intervalTime = (60000.0 / bpm) / 24.0;
  }
});
