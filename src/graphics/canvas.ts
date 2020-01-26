import { Matrix, Vector } from '../math'
import Text from "./shapes/text";
import * as chroma from 'chroma-js';


export interface CanvasParams {
  container: HTMLElement;
  backgroundColor?: string;
  coordinatesDelta?: number;
  displayBasis?: boolean;
  displayGrid?: boolean;
  displayNumbers?: boolean;
}

export interface CanvasShape {
  drawCanvas: DrawFunction;
  onUpdate: UpdateFunction;
  update?: Function;
  styles?: ShapeStyles;
}

export interface ShapeStyles {
  color: string;
  size: number;
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

  coordinatesDelta: number;
  displayBasis: boolean;
  displayGrid: boolean;
  displayNumbers: boolean;
  backgroundColor: string;

  externalShapes: Array<CanvasShape>;
  internalShapes: Array<CanvasShape>;

  transformMatrix: Matrix;
  translateVector: Vector;

  onUpdate: Function;
  ticker: number;

  mouseMove: Vector;
  mousePosition: [Vector, Vector];
  mouseDown: boolean;

  constructor (params: HTMLElement | CanvasParams) {
    if (params instanceof HTMLElement) {
      this.container = params;
      this.coordinatesDelta = 200;
      this.displayBasis = true;
      this.displayGrid = true;
      this.displayNumbers = true;
      this.backgroundColor = '#FFFFFF';
    } else {
      this.container = params.container;
      this.coordinatesDelta = isParam(params.coordinatesDelta, 200);
      this.displayBasis = isParam(params.displayBasis, true);
      this.displayGrid = isParam(params.displayGrid, true);
      this.displayNumbers = isParam(params.displayNumbers, true);
      this.backgroundColor = isParam(params.backgroundColor, '#FFFFFF');
    }
    this.ticker = 0;
    this.externalShapes = [];
    this.internalShapes = [];
    this.transformMatrix = new Matrix([[1, 0], [0, 1]]);
    this.translateVector = new Vector([0, 0]);
    this.createCanvas();
    this.startRender();
    this.registerEvents();
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

  private onMouseDown (evt: any) {
    this.mouseDown = true;
  }

  private onMouseUp (evt: any) {
    this.mouseDown = false;
  }

  private onMouseMove (evt: any) {
    const elePos = getMousePos(this.container, evt);
    let t = new Vector([elePos.x, elePos.y]).subtract(this.getTranslate());
    const position = this.getTransform().inverse2D().vectorProduct(t);
    if (!this.mousePosition) this.mousePosition = [position, position];
    this.mousePosition = [position, this.mousePosition[0]];
    this.mouseMove = this.mousePosition[0].subtract(this.mousePosition[1]);
  }

  private createCanvas () {
    const canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth;
    canvas.height = this.container.clientHeight;
    canvas.style.background = this.backgroundColor;
    this.container.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private registerEvents () {
    const parent = document.getElementById(this.container.id);
    parent.addEventListener('mousemove', this.onMouseMove.bind(this));
    parent.addEventListener('mousedown', this.onMouseDown.bind(this));
    parent.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onWindowResize () {
    this.container = document.getElementById(this.container.id);
    this.ctx.canvas.width = this.container.clientWidth;
    this.ctx.canvas.height = this.container.clientHeight;
  }

  private drawBasis () {
    const limit = this.getMax();
    this.ctx.beginPath();
    this.ctx.strokeStyle = invertColor(this.backgroundColor);
    this.ctx.lineWidth = 2;
    line(this.ctx, new Vector([0, 0]), new Vector([0, limit.y]));
    line(this.ctx, new Vector([0, 0]), new Vector([limit.x, 0]));
    this.ctx.stroke();
  }

  private drawGrid () {
    const limit = this.getMax();
    this.ctx.beginPath();
    this.ctx.strokeStyle = chroma(invertColor(this.backgroundColor)).alpha(0.5).hex();
    this.ctx.lineWidth = 1;
    // VERTICAL LINES
    for (let x = 0; x < limit.x; x += this.coordinatesDelta) {
      line(this.ctx, new Vector([x, 0]), new Vector([x, limit.y]));
      line(this.ctx, new Vector([-x, 0]), new Vector([-x, limit.y]));
    }
    // HORIZONTAL LINES
    for (let y = 0; y < limit.y; y += this.coordinatesDelta) {
      line(this.ctx, new Vector([0, y]), new Vector([limit.x, y]));
      line(this.ctx, new Vector([0, -y]), new Vector([limit.x, -y]));
    }
    this.ctx.stroke();
  }

  private drawNumbers () {
    const limit = this.getMax();
    const size = 15;
    const color = invertColor(this.backgroundColor);
    // VERTICAL AXIS
    for (let x = 0; x < limit.x; x += this.coordinatesDelta) {
      this.internalShapes.push(new Text(x + '', x, 0, size, color));
      this.internalShapes.push(new Text(-x + '', -x, 0, size, color));
    }
    // HORIZONTAL AXIS
    for (let y = 0; y < limit.y; y += this.coordinatesDelta) {
      this.internalShapes.push(new Text(y + '', 0, y, size, color));
      this.internalShapes.push(new Text(-y + '', 0, -y, size, color));
    }
  }

  private onTick () {
    if (this.mouseDown) {
      this.translateVector = this.translateVector.add(this.mouseMove);
    }
  }

  destroy () {
    this.startRender();
    this.container.removeChild(this.ctx.canvas);
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

    // draw coordinates
    if (this.displayGrid) this.drawGrid();
    if (this.displayBasis) this.drawBasis();
    if (this.displayNumbers) this.drawNumbers();

    this.onTick();
    if (this.onUpdate) this.onUpdate.call(this);

    for (let shape of this.internalShapes) {
      shape.drawCanvas(this.ctx);
    }

    for (let shape of this.externalShapes) {
      if (shape.update && this.mousePosition) {
        shape.update(this.mousePosition[0]);
      }
      if (shape.onUpdate) {
        shape.onUpdate.call(shape, this.ticker);
      }
      shape.drawCanvas(this.ctx);
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

// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMousePos (canvas: HTMLElement, evt: any) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function invertColor (hex: string, bw?: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  return "#" +
    padZero((255 - r).toString(16)) +
    padZero((255 - g).toString(16)) +
    padZero((255 - b).toString(16));

  function padZero (str: string, len = 2) {
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}

function isParam (param: any, defaultValue: any) {
  if (param === undefined) return defaultValue;
  else return param;
}