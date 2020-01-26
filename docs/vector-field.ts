import vectjs, { Circle, Matrix, Vector, VectorArrow } from "../src";
import * as chroma from 'chroma-js';


export default function () {
  const container = document.getElementById('canvas-container');
  const vect = vectjs({
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
  });
  const maxSpan = vect.getMax();
  const diff = 50;

  function getSpeed (position: Vector, time: number) {
    return new Vector([
      Math.sin(position.x + position.y + time),
      Math.sin(position.x + time) + Math.cos(time)
    ]);
  }

  for (let y = maxSpan.y - diff; y > -maxSpan.y; y -= diff) {
    for (let x = maxSpan.x - diff; x > -maxSpan.x + diff; x -= diff) {
      let p = new Vector([x, y]);
      let v = new Vector([Math.cos(x) * 30, Math.sin(y) * 30]);
      let s = new VectorArrow(p, v);
      s.onUpdate = function (time: number) {
        const v = getSpeed(this.start, time);
        this.vector = this.vector.add(v);
        this.renderVector = this.vector.scalarProduct(Math.pow(this.vector.abs(), -1) * 30);
        this.color = chroma(this.vector.abs(), 1, 0.6, 'hsl').desaturate(0.5).hex();
      };
      vect.addShape(s);
    }
  }

  let c = new Circle(new Vector([0, 0]), 10);
  // TODO: declarative update API
  c.onMouseOver = function () {
    return {
      color: 'red',
      size: 1.2
    }
  };
  vect.addShape(c);

  vect.onUpdate = function () {
    this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
  };

  return vect;
}