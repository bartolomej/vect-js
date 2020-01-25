import { Matrix, Vector } from '../math'

export interface CanvasShape {
  draw: DrawFunction;
  onUpdate: UpdateFunction;
}

export interface DrawFunction {
  (ctx: CanvasRenderingContext2D): void;
}

export interface UpdateFunction {
  (t: number): void;
}

export default class Canvas {

  ctx: CanvasRenderingContext2D;
  container: HTMLElement;
  animationFrame: number;

  externalShapes: Array<CanvasShape>;
  internalShapes: Array<CanvasShape>;

  transformMatrix: Matrix;
  translateVector: Vector;

  onUpdate: Function;
  ticker: number;

  constructor (container: HTMLElement) {
    this.container = container;
    this.externalShapes = [];
    this.internalShapes = [];
    this.ticker = 0;
    this.transformMatrix = new Matrix([[1, 0], [0, 1]]);
    this.translateVector = new Vector([0, 0]);
    this.createCanvas();
    this.startRender();
  }

  // initial translation => moves origin to canvas center
  private get translateZero () {
    return new Vector([
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2
    ]);
  }

  // initial transformation => flips space in y direction
  private get transformZero () {
    return new Matrix([[1, 0], [0, -1]]);
  }

  getTransform () {
    return this.transformZero.matrixProduct(this.transformMatrix);
  }

  getTranslate () {
    return this.translateVector.add(this.translateZero);
  }

  setTransform (m: Matrix) {
    this.transformMatrix = this.transformZero.matrixProduct(m);
  }

  setTranslate (v: Vector) {
    this.translateVector = this.translateZero.add(v);
  }

  transform (m: Matrix) {
    this.transformMatrix = this.transformMatrix.matrixProduct(m);
  }

  translate (v: Vector) {
    this.translateVector = this.translateVector.add(v);
  }

  addShape (s: CanvasShape) {
    this.externalShapes.push(s);
  }

  // returns max x,y value that is visible on canvas
  getMax () {
    let t = new Vector([0, 0]).add(this.getTranslate());
    let v = this.getTransform().inverse2D().vectorProduct(t);
    return new Vector([Math.abs(v.x), Math.abs(v.y)]);
  }

  private createCanvas () {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth;
    canvas.height = this.container.clientHeight;
    this.container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize () {
    this.container = document.getElementById(this.container.id);
    this.ctx.canvas.width = this.container.clientWidth;
    this.ctx.canvas.height = this.container.clientHeight;
  }

  private drawBasis () {
    const limit = this.getMax();
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    this.ctx.lineWidth = 2;
    line(this.ctx, new Vector([0, 0]), new Vector([0, limit.y]));
    line(this.ctx, new Vector([0, 0]), new Vector([limit.x, 0]));
    this.ctx.stroke();
  }

  private drawGrid () {
    const limit = this.getMax();
    const d = 50;
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    this.ctx.lineWidth = 1;
    // VERTICAL LINES
    for (let x = 0; x < limit.x; x += d) {
      line(this.ctx, new Vector([x, 0]), new Vector([x, limit.y]));
    }
    for (let x = 0; x > -limit.x; x -= d) {
      line(this.ctx, new Vector([x, 0]), new Vector([x, limit.y]));
    }
    // HORIZONTAL LINES
    for (let y = 0; y < limit.y; y += d) {
      line(this.ctx, new Vector([0, y]), new Vector([limit.x, y]));
    }
    for (let y = 0; y > -limit.y; y -= d) {
      line(this.ctx, new Vector([0, y]), new Vector([limit.x, y]));
    }
    this.ctx.stroke();
  }

  stopRender () {
    cancelAnimationFrame(this.animationFrame);
  }

  startRender () {
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

  render () {
    // reset transformations and clear canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const m = this.getTransform();
    const t = this.getTranslate();
    this.ctx.transform(m.x.x, m.x.y, m.y.x, m.y.y, t.x, t.y);

    this.drawGrid();
    this.drawBasis();

    if (this.onUpdate) this.onUpdate.call(this);

    for (let shape of this.externalShapes) {
      if (shape.onUpdate) shape.onUpdate.call(shape, this.ticker);
      shape.draw(this.ctx);
    }

    this.ticker += 0.01;
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

}

function line (ctx: any, p0: Vector, p1: Vector) {
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.moveTo(-p0.x, -p0.y);
  ctx.lineTo(-p1.x, -p1.y);
}