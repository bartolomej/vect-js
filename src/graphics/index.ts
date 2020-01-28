import Arrow from "./shapes/arrow";
import Text from "./shapes/text";
import Circle from "./shapes/circle";
import { RenderProps } from "./types";
import Canvas from "./canvas";


export { Shape } from "./types";
export { Arrow, Text, Circle };

export enum Context {
  CANVAS_2D,
  WEB_GL
}

export default function (ctx: Context, props: RenderProps) {
  if (ctx === Context.CANVAS_2D) {
    return new Canvas(props);
  } else {
    throw new Error(`Context '${ctx.toString()}' not supported!`);
  }
}
