export default class Timer {
  constructor(name, startedAt) {
    this.name = name;
    this.startedAt = startedAt;
  }
  static start(name) {
    return new Timer(name, Date.now());
  }
  get elapsed() {
    return Date.now() - this.startedAt;
  }
  record() {
    console.log(`${this.name} took ${this.elapsed}`);
  }
}

