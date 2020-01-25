import Matrix from "./matrix";

export default class Vector {

  components: Array<number>;

  constructor (components: Array<number>) {
    this.components = components;
  }

  get dimensions () {
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

  abs () {
    let sqSum = 0;
    for (let i of this.components) {
      sqSum += i**2;
    }
    return Math.sqrt(sqSum);
  }

  dotProduct (a: Vector) {
    if (this.dimensions !== a.dimensions) {
      return undefined;
    }
    let sum = 0;
    for (let i = 0; i < this.dimensions; i++) {
      sum += this.components[i] * a.components[i];
    }
    return sum;
  }

  scalarProduct (n: number) {
    return new Vector(this.components.map(e => e * n));
  }

  add (a: Vector) {
    if (this.dimensions !== a.dimensions) {
      return undefined;
    }
    let comp = [];
    for (let i = 0; i < this.dimensions; i++) {
      comp.push(this.components[i] + a.components[i]);
    }
    return new Vector(comp);
  }

  subtract (a: Vector) {
    if (this.dimensions !== a.dimensions) {
      return undefined;
    }
    let comp = [];
    for (let i = 0; i < this.dimensions; i++) {
      comp.push(this.components[i] - a.components[i]);
    }
    return new Vector(comp);
  }

  equals (a: Vector) {
    for (let i = 0; i < this.dimensions; i++) {
      if (this.components[i] !== a.components[i]) return false;
    }
    return true;
  }

}