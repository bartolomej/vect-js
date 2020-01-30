import Vect, { Context, Controls, InputType, Shape, Vector } from "../../index";
import { ControlsType } from "../../ui/index";

window.addEventListener('load', render);

function render () {
  const container = document.createElement('div');
  container.style.height = '100vh';
  container.style.width = '100vw';

  document.body.appendChild(container);

  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: true,
    highPixelDensity: true
  });


  const arrow1 = new Shape.Arrow(null, new Vector([100,50]), '#FFFFFF');
  const arrow2 = new Shape.Arrow(null, new Vector([50,100]), '#FFFFFF');
  const sum = new Shape.Arrow(null, arrow1.vector.add(arrow2.vector), '#db002f');
  const sub = new Shape.Arrow(null, arrow1.vector.subtract(arrow2.vector), '#0032db');
  const dot = new Shape.Circle(new Vector([arrow1.vector.dotProduct(arrow2.vector), 0]), 10, '#FFFFFF', '#FFFFFF');

  vect.onUpdate = function () {
    sum.vector = arrow1.vector.add(arrow2.vector);
    sub.vector = arrow1.vector.subtract(arrow2.vector);
    dot.position = new Vector([arrow1.vector.dotProduct(arrow2.vector), 0]);
  };

  vect.addShapes([arrow1,arrow2,sum,sub,dot]);


  let maxMinValues = {
    maxValue: 100,
    minValue: -100,
  };

  let controls = new Controls([
    {
      type: ControlsType.INPUT,
      label: 'vector1 i',
      inputType: InputType.RANGE,
      value: arrow1.vector.x,
      ...maxMinValues,
      onInput: e => arrow1.vector.x = e.target.valueAsNumber
    },
    {
      type: ControlsType.INPUT,
      label: 'vector1 j',
      inputType: InputType.RANGE,
      value: arrow1.vector.y,
      ...maxMinValues,
      onInput: e => arrow1.vector.y = e.target.valueAsNumber
    },
    {
      type: ControlsType.INPUT,
      label: 'j component',
      inputType: InputType.RANGE,
      value: arrow2.vector.x,
      ...maxMinValues,
      onInput: e => arrow2.vector.x = e.target.valueAsNumber
    },
    {
      type: ControlsType.BUTTON,
      text: 'test',
      ...maxMinValues,
      onClick: e => arrow2.vector.y = e.target.valueAsNumber
    }
  ], { color: '#FFFFFF' });

  document.body.appendChild(controls.domElement);
}