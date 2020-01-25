import Vector from "./vector";

export default class Matrix {

  components: Array<Vector>;

  constructor (components: Array<any>) {
    if (components[0] instanceof Vector) {
      // @ts-ignore
      this.components = components;
    } else if (typeof components[0][0] === 'number') {
      // @ts-ignore
      this.components = components.map(e => new Vector(e));
    } else {
      throw new Error('Invalid matrix components.')
    }
  }

  get rows () {
    return this.components[0].dimensions;
  }

  get cols () {
    return this.components.length;
  }

  get x () {
    return this.components[0];
  }

  get y () {
    return this.components[1];
  }

  get z () {
    return this.components[2];
  }

  determinate2D () {
    return (
      (this.components[1].y * this.components[0].x) -
      (this.components[1].x * this.components[0].y)
    );
  }

  inverse2D () {
    let t = new Matrix([
      [this.components[1].y, -this.components[0].y],
      [-this.components[1].x, this.components[0].x]
    ]);
    return t.scalarProduct(1 / this.determinate2D())
  }

  add (m: Matrix) {
    let comp = [];
    for (let i = 0; i < this.cols; i++) {
      comp.push(this.components[i].add(m.components[i]));
    }
    return new Matrix(comp);
  }

  matrixProduct (m: Matrix) {
    let comp = [];
    for (let i = 0; i < this.cols; i++) {
      comp.push(this.vectorProduct(m.components[i]));
    }
    return new Matrix(comp);
  }

  scalarProduct (n: number) {
    let comp = [];
    for (let i = 0; i < this.cols; i++) {
      comp.push(this.components[i].scalarProduct(n));
    }
    return new Matrix(comp);
  }

  vectorProduct (v: Vector) {
    let T = new Vector(new Array(this.cols).fill(0));
    for (let i = 0; i < this.cols; i++) {
      T = T.add(this.components[i].scalarProduct(v.components[i]));
    }
    return T;
  }

  toString () {
    let out = '[';
    for (let i = 0; i < this.cols; i++) {
      out += this.components[i].toString() + (i + 1 === this.cols ? '' : ', ');
    }
    out += ']';
    return out;
  }

}