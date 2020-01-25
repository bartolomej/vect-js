import { Canvas, Matrix, Vector, VectorCanvas, CircleCanvas, TextCanvas } from "../index";

window.onload = function () {
  const container = document.getElementById('canvas-container');
  const canvas = new Canvas(container);
  canvas.transform(new Matrix([[1,0],[0,1]]));

  const v1 = new Vector([100,100]);
  const v1Shape = new VectorCanvas(new Vector([100,100]), v1);
  canvas.addShape(v1Shape);

  const p1 = new Vector([-100,100]);
  const p1Shape = new CircleCanvas(p1, 50);
  canvas.addShape(p1Shape);

  const t1 = new TextCanvas('a', 0,0);
  canvas.addShape(t1);
};