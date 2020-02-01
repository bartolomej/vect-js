import { MouseCallback, Shape, ShapeStyles, UpdateFunction } from "../types";
import { Vector } from "../../math/index";

export default class Circle implements Shape {

  r: number;
  name: string;

  position: Vector;
  onUpdate: UpdateFunction;
  onHover: MouseCallback;
  onDrag: MouseCallback;
  onClick: MouseCallback;
  state: Object;

  styles: ShapeStyles;
  defaultStyles: ShapeStyles;
  isPressed: boolean;

  constructor (position: Vector, r: number, fillColor?: string, strokeColor?: string, name?: string) {
    this.position = position;
    this.r = r;
    this.name = name || 'A';
    this.state = {};
    this.styles = {
      fillColor: fillColor || '#000000',
      strokeColor: strokeColor || '#000000',
      size: 1,
      cursor: 'normal'
    };
    this.defaultStyles = Object.assign({}, this.styles);
    this.isPressed = false;
  }

  intersectsMouse (position: Vector) {
    return dist(this.position, position) <= this.r;
  }

  drawCanvas (ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r * this.styles.size, 0, 2 * Math.PI);
    ctx.strokeStyle = this.styles.strokeColor;
    ctx.fillStyle = this.styles.fillColor;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

}

function dist (pos1: Vector, pos2: Vector) {
  const dp = pos1.subtract(pos2);
  return Math.sqrt(dp.x ** 2 + dp.y ** 2);
}