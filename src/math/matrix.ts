import Vector from "./vector";

export default class Matrix {

  components: Array<Vector>;

  constructor (components: Array<Vector>) {
    this.components = components;
  }

  get rows () {
    return this.components[0].dimensions;
  }

  get cols () {
    return this.components.length;
  }

  add (m: Matrix) {
    let comp = [];
    for (let i = 0; i < this.cols; i++) {
      comp.push(this.components[i].add(m.components[i]));
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
    if (this.cols !== v.dimensions) {
      return undefined;
    }
    let comp = [];
    for (let i = 0; i < this.cols; i++) {
      comp.push(this.components[i].scalarProduct(v.components[i]));
    }
    return new Matrix(comp);
  }

}