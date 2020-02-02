import Vect, { Context, Controls, InputType, Matrix, Shape, Vector } from "../../index";
import chroma from 'chroma-js';
import { MouseState } from "../../graphics/types";

window.addEventListener('load', onLoad);

function onLoad () {
  const pendulumContainer = document.createElement('div');
  pendulumContainer.classList.add('section');

  const fieldContainer = document.createElement('div');
  fieldContainer.classList.add('section');

  document.getElementById('container').append(pendulumContainer, fieldContainer);

  renderPendulum(pendulumContainer);
  renderField(fieldContainer);
}

function renderPendulum (container: HTMLElement) {
  // @ts-ignore
  window.Vector = Vector;
  // @ts-ignore
  window.Matrix = Matrix;
  // @ts-ignore
  window.vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: true,
    displayBasis: true,
    displayGrid: true,
    enableMouseMove: true
  });

  const pendulumEnd = new Vector([0,-100]);
  const pendulum = new Shape.Arrow(null, pendulumEnd, '#FFFFFF', null, false);
  const ball = new Shape.Circle(pendulumEnd, 10, '#FFFFFF');
  ball.onDrag = function (m: MouseState) {
    this.position = m.position;
    pendulum.vector = m.position;
    return {
      fillColor: '#FF0000'
    }
  };

  // @ts-ignore
  window.vect.addShapes([pendulum, ball]);
}

function renderField (container: HTMLElement) {

  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false,
    enableMouseMove: true
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
      //s.unitScale = true;
      //s.unitScaleFactor = 20;
      s.onUpdate = function (time: number) {
        this.vector = getSpeed(this.position, time);
        this.color = chroma(this.vector.abs(), 1, 0.6, 'hsl').desaturate(0.5).hex();
      };
      vect.addShape(s);
    }
  }

}