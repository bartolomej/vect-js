import { CanvasShape, ShapeStyles, UpdateFunction } from "../canvas";
import { Vector } from "../../math";

export default class Circle implements CanvasShape {

  position: Vector;
  r: number;
  color: string;
  name: string;
  onUpdate: UpdateFunction;
  onMouseOver: Function;
  styles: ShapeStyles;

  constructor (position: Vector, r: number, color?: string, name?: string) {
    this.position = position;
    this.r = r;
    this.color = color || '#000000';
    this.name = name || 'A';
    this.styles = { size: r, color: this.color };
  }

  update (mousePos: Vector) {
    const isOver = this.distance(mousePos) < this.r;
    if (isOver && this.onMouseOver) {
      const styles = this.onMouseOver();
      if (styles.color) this.color = styles.color;
      if (styles.size && this.r === this.styles.size) this.r = this.r * styles.size;
    } else if (!isOver) {
      this.color = this.styles.color;
      this.r = this.styles.size;
    }
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