import { CanvasShape, UpdateFunction } from "../canvas";
import { Vector } from "../../math";

export default class CircleCanvas implements CanvasShape {

  position: Vector;
  r: number;
  color: string;
  name: string;
  onUpdate: UpdateFunction;

  constructor (position: Vector, r: number, color?: string, name?: string) {
    this.position = position;
    this.r = r;
    this.color = color || '#000000';
    this.name = name || 'A';
  }

  draw (ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

}