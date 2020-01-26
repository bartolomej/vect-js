import Canvas, { CanvasParams } from "./graphics/canvas";
import Matrix from "./math/matrix";
import Vector from "./math/vector";
import VectorArrow from "./graphics/shapes/vector";
import Text from "./graphics/shapes/text";
import Circle from "./graphics/shapes/circle";

export {
  VectorArrow,
  Text,
  Circle,
  Matrix,
  Vector
};

export default function (params: CanvasParams) {
  return new Canvas(params);
}