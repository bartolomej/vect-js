import { Vector } from "../../math";
import { CanvasShape, UpdateFunction } from "../canvas";

export default class VectorCanvas implements CanvasShape {

  color: string;
  name: string;
  start: Vector;
  vector: Vector;
  renderVector: Vector;
  onUpdate: UpdateFunction;

  constructor (v0: Vector, v1: Vector, color?: string, name?: string) {
    this.start = v0 || new Vector([0, 0]);
    this.vector = v1;
    this.color = color || '#000000';
    this.name = name || 'a';
  }

  get end () {
    if (this.renderVector) {
      return this.start.add(this.renderVector);
    } else {
      return this.start.add(this.vector);
    }
  }

  draw (ctx: CanvasRenderingContext2D) {
    const size = 10;
    const width = 0.7;

    let a = Math.atan(this.vector.y / this.vector.x);

    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.moveTo(this.end.x, this.end.y);

    const dxLeft = Math.cos(a - width) * size;
    const dxRight = Math.cos(a + width) * size;
    const dyTop = Math.sin(a - width) * size;
    const dyBottom = Math.sin(a + width) * size;

    if (this.vector.x < 0) {
      ctx.lineTo(this.end.x + dxLeft, this.end.y + dyTop);
      ctx.lineTo(this.end.x + dxRight, this.end.y + dyBottom);
    } else {
      ctx.lineTo(this.end.x - dxLeft, this.end.y - dyTop);
      ctx.lineTo(this.end.x - dxRight, this.end.y - dyBottom);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

}