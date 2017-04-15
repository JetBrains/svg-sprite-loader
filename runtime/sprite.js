class Sprite {
  constructor() {
    this.symbols = [];
  }

  add(s) {
    this.symbols.push(s);
    return s;
  }
}

export default new Sprite();
