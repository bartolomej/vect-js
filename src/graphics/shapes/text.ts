export enum Weight {
  BOLD = 'bold',
  NORMAL = 'normal',
  LIGHTER = 'lighter'
}

export default class TextCanvas {

  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
  weight: Weight;

  constructor (text: string, x: number, y: number, size?: number, color?: string, weight?: Weight) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = size || 24;
    this.weight = weight || Weight.NORMAL;
    this.color = color || '#000000';
  }

  draw (ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.scale(1, -1);
    ctx.textAlign = 'center';
    ctx.font = `${this.weight} ${this.size}px Times New Roman`;
    ctx.fillStyle = this.color || '#000000';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }

}