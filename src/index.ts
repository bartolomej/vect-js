import Renderer from "./graphics/index";
import Arrow from "./graphics/shapes/arrow";
import Text from "./graphics/shapes/text";
import Circle from "./graphics/shapes/circle";

export { Matrix, Vector } from './math/index';
export { Context } from './graphics/index';

export const Shape = {
  Arrow,
  Text,
  Circle
};

export default Renderer;