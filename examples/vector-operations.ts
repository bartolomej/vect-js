import Vect, { Shape, Context, Vector } from "../src/index";


export default function (container) {
  const vect = Vect(Context.CANVAS_2D, {
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
  });

  let p0 = new Vector([-50,-100]);

  const v1 = new Shape.Arrow(p0, new Vector([100,50]), '#FFFFFF');
  const v2 = new Shape.Arrow(p0, new Vector([50,100]), '#FFFFFF');
  const sum1 = new Shape.Arrow(p0, v1.vector.add(v2.vector), '#db002f');

  vect.addShapes([v1,v2,sum1]);

  return vect;
}