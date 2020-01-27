import { Canvas, Circle, Matrix, Vector, VectorArrow } from "../src/index";


export default function (container) {
  const vect = new Canvas({
    container,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
  });

  const v1 = new VectorArrow(null, new Vector([100,50]), '#FFFFFF');
  const v2 = new VectorArrow(null, new Vector([50,100]), '#FFFFFF');
  const sum1 = new VectorArrow(null, v1.vector.add(v2.vector), '#db002f');

  vect.addShapes([v1,v2,sum1]);

  return {
    vect,
    description: 'Example vector operations',
    title: 'Vector operations'
  }
}