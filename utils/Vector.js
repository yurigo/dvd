export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }
}
