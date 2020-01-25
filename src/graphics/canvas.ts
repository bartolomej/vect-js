import { Matrix, Vector } from '../math'

export interface CanvasShape {
  draw: DrawFunction;
}

interface DrawFunction {
  (ctx: CanvasRenderingContext2D): void;
}

export default class Canvas {

  ctx: CanvasRenderingContext2D;
  container: HTMLElement;
  animationFrame: number;

  externalShapes: Array<CanvasShape>;
  internalShapes: Array<CanvasShape>;

  transformMatrix: Matrix;
  translateVector: Vector;

  onTick: Function;
  ticker: number;

  constructor (container: HTMLElement) {
    this.container = container;
    this.externalShapes = [];
    this.internalShapes = [];
    this.onTick = null;
    this.ticker = 0;
    this.transformMatrix = new Matrix([[1, 0], [0, 1]]);
    this.translateVector = new Vector([0, 0]);
    this.createCanvas();
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

  private createCanvas () {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth;
    canvas.height = this.container.clientHeight;
    this.container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize () {
    this.container = document.getElementById(this.container.id);
    this.ctx.canvas.width = this.container.clientWidth;
    this.ctx.canvas.height = this.container.clientHeight;
  }

  stopRendering () {
    cancelAnimationFrame(this.animationFrame);
  }

  render () {
    // reset transformations and clear canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    const m = this.getTransform();
    const t = this.getTranslate();
    this.ctx.transform(m.x.x, m.x.y, m.y.x, m.y.y, t.x, t.y);

    for (let shape of this.externalShapes) {
      shape.draw(this.ctx);
    }

    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

}