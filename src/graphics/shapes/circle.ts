import { Shape, UpdateFunction } from "../types";
import { Vector } from "../../math/index";

export default class Circle implements Shape {

  r: number;
  color: string;
  name: string;
  onMouseOver: Function;

  position: Vector;
  onUpdate: UpdateFunction;
  state: Object;

  constructor (position: Vector, r: number, color?: string, name?: string) {
    this.position = position;
    this.r = r;
    this.color = color || '#000000';
    this.name = name || 'A';
    this.state = {};
  }

  distance (v: Vector) {
    return this.position.subtract(v).abs();
  }

  drawCanvas (ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

}