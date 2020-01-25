import { Canvas, Matrix, Vector, VectorCanvas } from "../index";
// @ts-ignore
import * as chroma from 'chroma-js';

window.onload = vectorField;

function vectorField () {
  const container = document.getElementById('canvas-container');
  const canvas = new Canvas(container);
  const maxSpan = canvas.getMax();
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
      let s = new VectorCanvas(p, v);
      canvas.addShape(s);
      s.onUpdate = function (time: number) {
        const v = getSpeed(this.start, time);
        this.vector = this.vector.add(v);
        this.renderVector = this.vector.scalarProduct(Math.pow(this.vector.abs(), -1) * 30);
        this.color = chroma(this.vector.abs(), 1, 0.6, 'hsl').desaturate(0.5).hex();
      };
    }
  }
  canvas.onUpdate = function () {
    this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
  }
}