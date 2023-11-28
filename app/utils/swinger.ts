import Bpm from './bpm';

class Swinger {
  isPlaying: boolean = false;
  callback: () => void;
  // even notes
  tick: Bpm;
  // odd notes that have swing
  tack: Bpm;

  tempo: number;
  // swing is a percentage of how close the note is to the previous note
  // swing of 0 is far away, swing of 1 is at the same time as previousNote;
  // this is the reason we have 2 Timers. Only use second Timer if there is swing
  // to avoid unneeded drifts
  swing: number;

  constructor(callback: () => void, tempo: number, swing:number = 0) {
    this.callback = callback;
    this.tempo = tempo;
    this.swing = swing;

    if (swing === 0) {
      this.tick = new Bpm(this.swingCallback(true), tempo, 0);
    } else {
      this.setSwing(swing);
    }
  }

  start() {
    if (this.swing === 0) {
      this.tick.start();
    } else {
      this.tick.start();
      this.tack.start();
    }

    this.isPlaying = true;
  }

  stop() {
    if (this.swing === 0) {
      this.tick.stop();
    } else {
      this.tick.stop();
      this.tack.stop();
    }

    this.isPlaying = false;
  }

  swingCallback(tick: boolean): () => any {
    let that = this;
    return () => {
      if (tick) {
        that.callback();
      } else if (!tick) {
        that.callback();
      }
    }
  }

  setCallback(callback: () => {}) {
    this.callback = callback;
  }

  setTempo(tempo: number) {
    this.tempo = tempo;


      this.tick.setTempo(tempo);

  }

  setSwing(swing: number) {
    this.swing = swing;

    if (this.swing === 0) {
      this.tick = new Bpm(this.swingCallback(true), this.tempo, 0)
    } else {
      this.tick = new Bpm(this.swingCallback(true), this.tempo / 2, 0)
      // The swing is applied to the second note making it closer to the next odd beat, so the 2n becomes closer to the next 2n+1
      // The swing goes from 0 to 1, where 0 is no swing and 1 is half the subdvision. In this case an 8th of a note
      let offset = (this.tick.timeInterval / 2) + ((this.tick.timeInterval / 4) * swing);
      // console.log('offset', offset);
      this.tack = new Bpm(this.swingCallback(false), this.tempo / 2, offset);
    }
  }
}

export default Swinger;
