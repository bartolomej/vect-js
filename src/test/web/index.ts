import Vect, { Context, Controls, InputType, Shape, Vector } from "../../index";
import { ControlsType } from "../../ui/index";
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

  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false,
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

  vect.addShapes([pendulum, ball]);
}

function renderField (container: HTMLElement) {

  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false,
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
      let v = new Vector([Math.cos(x), Math.sin(y)]);
      let s = new Shape.Arrow(p, v, '#FFFFFF');

      s.onUpdate = function (time: number) {
        this.vector = this.vector.add(getSpeed(this.position, time));
      };
      vect.addShape(s);
    }
  }

}