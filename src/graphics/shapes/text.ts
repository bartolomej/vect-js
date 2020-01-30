import { Shape, UpdateFunction } from "../types";
import Vector from "../../math/vector";

export enum Weight {
  BOLD = 'bold',
  NORMAL = 'normal',
  LIGHTER = 'lighter'
}

export default class Text implements Shape {

  text: string;
  size: number;
  color: string;
  weight: Weight;

  position: Vector;
  state: Object;
  onUpdate: UpdateFunction;

  constructor (text: string, position: Vector, size?: number, color?: string, weight?: Weight) {
    this.position = position;
    this.text = text;
    this.size = size || 20;
    this.weight = weight || Weight.NORMAL;
    this.color = color || '#000000';
    this.state = {};
  }

  drawCanvas (ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.scale(1, -1);
    ctx.textAlign = 'center';
    ctx.font = `${this.weight} ${this.size}px Times New Roman`;
    ctx.fillStyle = this.color || '#000000';
    ctx.fillText(this.text, this.position.x, this.position.y);
    ctx.restore();
  }

}