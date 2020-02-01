import { Vector } from "../../math/index";
import { Shape, UpdateFunction } from "../types";


export default class Arrow implements Shape {

  color: string;
  name: string;
  drawArrow: boolean;
  unitScale: boolean;
  unitScaleFactor: number;

  vector: Vector;
  onUpdate: UpdateFunction;

  position: Vector;
  state: Object;

  constructor (v0: Vector, v1: Vector, color?: string, name?: string, drawArrow?: boolean) {
    this.position = v0 || new Vector([0, 0]);
    this.vector = v1;
    this.color = color || '#000000';
    this.name = name || 'a';
    this.unitScale = false;
    this.drawArrow = drawArrow || true;
    this.unitScaleFactor = 1;
    this.state = {};
  }

  drawCanvas (ctx: CanvasRenderingContext2D) {
    const size = 10;
    const width = 0.7;

    const a = Math.atan(this.vector.y / this.vector.x);
    const scaleFactor = Math.pow(this.vector.abs(), -1) * this.unitScaleFactor;
    const head = this.position.add(this.unitScale
      ? this.vector.scalarProduct(scaleFactor)
      : this.vector);

    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(head.x, head.y);
    ctx.moveTo(head.x, head.y);

    // draw vector arrow shape
    if (this.drawArrow) {
      const dxLeft = Math.cos(a - width) * size;
      const dxRight = Math.cos(a + width) * size;
      const dyTop = Math.sin(a - width) * size;
      const dyBottom = Math.sin(a + width) * size;

      if (this.vector.x < 0) {
        ctx.lineTo(head.x + dxLeft, head.y + dyTop);
        ctx.lineTo(head.x + dxRight, head.y + dyBottom);
      } else {
        ctx.lineTo(head.x - dxLeft, head.y - dyTop);
        ctx.lineTo(head.x - dxRight, head.y - dyBottom);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

}