import Timer from './timer';

class Bpm extends Timer {
  constructor(callback: () => {}, tempo: number, startOffset:number = 0) {
    super(callback, 0, startOffset);

    this.setTempo(tempo);
  }

  setTempo(tempo: number) {
    // 60000 ms = 1 minute
    // Tempo = BPM
    this.timeInterval = ((60000 / tempo)/ 2)/6;
  }
}

export default Bpm;
