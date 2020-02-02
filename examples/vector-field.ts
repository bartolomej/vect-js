import Vect, { Context, Shape, Vector } from "../src/index";
import chroma from 'chroma-js';


export default function (container) {
  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
  });
  const [topLeft, bottomRight] = vect.getBoundaries();
  const delta = 50;

  function getSpeed (position: Vector, time: number) {
    return new Vector([
      Math.sin(position.x + position.y + time),
      Math.sin(position.x + time) + Math.cos(time)
    ]);
  }

  for (let y = topLeft.y - delta; y > bottomRight.y; y -= delta) {
    for (let x = topLeft.x - delta; x < bottomRight.x + delta; x += delta) {
      let p = new Vector([x, y]);
      let v = new Vector([Math.cos(x), Math.sin(y)]);
      let s = new Shape.Arrow(p, v);
      s.unitScale = true;
      s.unitScaleFactor = 20;
      s.onUpdate = function (time: number) {
        this.vector = this.vector.add(getSpeed(this.position, time));
        this.color = chroma(this.vector.abs(), 1, 0.6, 'hsl').desaturate(0.5).hex();
      };
      vect.addShape(s);
    }
  }

  return vect;
}