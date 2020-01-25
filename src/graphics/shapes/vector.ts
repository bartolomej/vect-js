import { Vector } from "../../math";
import { CanvasShape } from "../canvas";

export default class VectorCanvas implements CanvasShape{

  color: string;
  name: string;
  start: Vector;
  vector: Vector;

  constructor (v0: Vector, v1: Vector, color?: string, name?: string) {
    this.start = v0 || new Vector([0,0]);
    this.vector = v1;
    this.color = color || '#000000';
    this.name = name || 'a';
  }

  get end () {
    return this.start.add(this.vector);
  }

  draw (ctx: CanvasRenderingContext2D) {
    const s = 7;
    const w = 0.7;

    let a = Math.atan(this.end.y / this.end.x);

    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.moveTo(this.end.x, this.end.y);

    if (this.end.x < 0) {
      ctx.lineTo(this.end.x + Math.cos(a - w) * s, this.end.y + Math.sin(a - w) * s);
      ctx.lineTo(this.end.x + Math.cos(a + w) * s, this.end.y + Math.sin(a + w) * s);
    } else {
      ctx.lineTo(this.end.x - Math.cos(a - w) * s, this.end.y - Math.sin(a - w) * s);
      ctx.lineTo(this.end.x - Math.cos(a + w) * s, this.end.y - Math.sin(a + w) * s);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

}