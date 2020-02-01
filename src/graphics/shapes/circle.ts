import { MouseCallback, MouseState, Shape, UpdateFunction } from "../types";
import { Vector } from "../../math/index";

export default class Circle implements Shape {

  r: number;
  fillColor: string;
  strokeColor: string;
  name: string;

  position: Vector;
  onUpdate: UpdateFunction;
  onHover: MouseCallback;
  onDrag: MouseCallback;
  state: Object;

  constructor (position: Vector, r: number, fillColor?: string, strokeColor?: string, name?: string) {
    this.position = position;
    this.r = r;
    this.fillColor = fillColor || '#000000';
    this.strokeColor = strokeColor || '#000000';
    this.name = name || 'A';
    this.state = {};
  }

  distance (v: Vector) {
    return this.position.subtract(v).abs();
  }

  update (m: MouseState) {
    const dp = this.position.subtract(m.position);
    const d = Math.sqrt(dp.x**2 + dp.y**2);

    if (d <= this.r && !m.isDown) {
      this.onHover && this.onHover.call(this, m);
    }
    if (d <= this.r && m.isDown) {
      this.onDrag && this.onDrag.call(this, m);
    }
  }

  drawCanvas (ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = this.strokeColor;
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

}