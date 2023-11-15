//irshad

class Timer {
  timeInterval: number = 1000;
  startOffset: number = 0;
  callback: () => void;

  timeout: NodeJS.Timeout;
  drift: number = 0;
  expected: number;

  constructor(callback: () => void, timeInterval: number, startOffset:number = 0) {
    this.callback = callback;
    this.timeInterval = timeInterval;
    this.startOffset = startOffset;
  }

  start() {
    this.expected = Date.now() + this.startOffset;
    this.timeout = setTimeout(this.preTick.bind(this), this.startOffset);
  }

  preTick() {
    let drift = Date.now() - this.expected;

    this.expected += this.timeInterval;
    this.timeout = setTimeout(this.tick.bind(this), this.timeInterval - drift);
  }

  stop() {
    clearTimeout(this.timeout);
  }

  tick() {
    let drift = Date.now() - this.expected;

    this.callback();
    this.expected += this.timeInterval;
    this.timeout = setTimeout(this.tick.bind(this), this.timeInterval - drift);
  }
}

export default Timer;
