import { Matrix, Vector } from '../math/index'
import Text from "./shapes/text";
import { MouseState, RenderProps, Shape } from "./types";
import { call, getMousePos, getPixelRatio, invertColor, isParam } from "../utils";


export default class Canvas {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  container: HTMLElement;
  animationFrame: number;

  coordinatesDelta: number;
  displayBasis: boolean;
  displayGrid: boolean;
  displayNumbers: boolean;
  backgroundColor: string;
  enableMouseMove: boolean;
  highPixelDensity: boolean;
  pixelRatioFactor: number;

  externalShapes: Array<Shape>;
  internalShapes: Array<Shape>;

  transformMatrix: Matrix;
  translateVector: Vector;

  onUpdate: Function;
  ticker: number;

  // MOUSE STATE VARS
  mouseDown: boolean;
  mouseAbsolutePosition: [Vector, Vector]; // untransformed position [current, previous]
  mousePosition: Vector;

  constructor (params: HTMLElement | RenderProps) {
    if (params instanceof HTMLElement) {
      this.container = params;
      this.coordinatesDelta = 200;
      this.displayBasis = true;
      this.displayGrid = true;
      this.displayNumbers = true;
      this.backgroundColor = '#FFFFFF';
      this.enableMouseMove = false;
      this.highPixelDensity = false;
      this.pixelRatioFactor = null;
      this.createCanvas();
    } else {
      this.container = params.container;
      this.coordinatesDelta = isParam(params.coordinatesDelta, 200);
      this.displayBasis = isParam(params.displayBasis, true);
      this.displayGrid = isParam(params.displayGrid, true);
      this.displayNumbers = isParam(params.displayNumbers, true);
      this.backgroundColor = isParam(params.backgroundColor, '#FFFFFF');
      this.enableMouseMove = isParam(params.enableMouseMove, false);
      this.highPixelDensity = isParam(params.highPixelDensity, false);
      this.pixelRatioFactor = isParam(params.pixelRatioFactor, null);
      this.createCanvas(params.width, params.height);
    }
    this.ticker = 0;
    this.externalShapes = [];
    this.internalShapes = [];
    this.transformMatrix = new Matrix([[1, 0], [0, 1]]);
    this.translateVector = new Vector([0, 0]);
    this.startRender();
    this.registerEvents();
    this.container.style.cursor = this.enableMouseMove ? 'grab' : 'default';
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

  getMouseState (): MouseState {
    return {
      isDown: this.mouseDown,
      absolutePosition: this.mouseAbsolutePosition[0],
      position: this.mousePosition
    }
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

  zoomIn (rate?: number) {
    const zoomRate = rate || 1.0001;
    this.transform(new Matrix([[zoomRate, 0], [0, zoomRate]]));
  }

  zoomOut (rate?: number) {
    const zoomRate = rate || 0.9999;
    this.transform(new Matrix([[zoomRate, 0], [0, zoomRate]]));
  }

  translate (v: Vector) {
    this.translateVector = this.translateVector.add(v);
  }

  addShape (s: Shape) {
    this.externalShapes.push(s);
  }

  addShapes (s: Array<Shape>) {
    for (let shape of s) {
      this.externalShapes.push(shape);
    }
  }

  // returns max x,y value that is visible on canvas
  getMax () {
    let t = new Vector([0, 0]).add(this.getTranslate());
    let v = this.getTransform().inverse2D().vectorProduct(t);
    return new Vector([Math.abs(v.x), Math.abs(v.y)]);
  }

  getRatio () {
    return this.highPixelDensity
      ? this.pixelRatioFactor ? this.pixelRatioFactor : getPixelRatio(this.ctx)
      : 1;
  }

  private onMouseClick (evt: Event) {
    this.externalShapes.forEach(s => {
      const intersects = call(s.intersectsMouse, s, [this.mousePosition]);
      if (intersects && s.onClick) {
        const styles = call(s.onClick, s, [this.getMouseState()]);
        s.styles = { ...s.styles, ...styles };
      }
    })
  }

  private onMouseDown (evt: Event) {
    this.mouseDown = true;
    // calls internal mouse state update callback
    this.externalShapes.forEach(s => {
      const intersects = call(s.intersectsMouse, s, [this.mousePosition]);
      if (intersects && s.isPressed !== undefined) {
        s.isPressed = true;
      }
    });
    if (this.enableMouseMove) {
      this.container.style.cursor = 'grabbing';
    }
  }

  private onMouseUp (evt: Event) {
    this.mouseDown = false;
    // calls internal mouse state update callback
    this.externalShapes.forEach(s => {
      const intersects = call(s.intersectsMouse, s, [this.mousePosition]);
      if (intersects && s.isPressed !== undefined) {
        s.isPressed = false;
      }
    });
    if (this.enableMouseMove) {
      this.container.style.cursor = 'grab';
    }
  }

  private onMouseMove (evt: any) {
    const position = getMousePos(this.container, evt);
    const abs = new Vector([position.x, position.y]);
    if (!this.mouseAbsolutePosition) this.mouseAbsolutePosition = [abs,abs];
    // save absolute mouse position (without transformations)
    this.mouseAbsolutePosition = [abs, this.mouseAbsolutePosition[0]];
    // save transformed mouse position
    const translated = abs.subtract(this.getTranslate());
    this.mousePosition = this.getTransform().inverse2D().vectorProduct(translated);
  }

  private createCanvas (width?: number, height?: number) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    const ratio = this.getRatio();
    this.canvas.width = (width || this.container.clientWidth) * ratio;
    this.canvas.height = (height || this.container.clientHeight) * ratio;
    if (ratio !== 1) {
      this.canvas.style.width = (width || this.container.clientWidth) + 'px';
      this.canvas.style.height = (height || this.container.clientHeight) + 'px';
    }
    this.canvas.style.background = this.backgroundColor;
    this.container.appendChild(this.canvas);
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private registerEvents () {
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.container.addEventListener('click', this.onMouseClick.bind(this));
  }

  private onWindowResize () {
    this.ctx.canvas.width = this.container.clientWidth * this.getRatio();
    this.ctx.canvas.height = this.container.clientHeight * this.getRatio();
    this.canvas.style.width = this.container.clientWidth + 'px';
    this.canvas.style.height = this.container.clientHeight + 'px';
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
    this.ctx.strokeStyle = invertColor(this.backgroundColor) + '80';
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
      this.internalShapes.push(new Text(x + '', new Vector([x,0]), size, color));
      this.internalShapes.push(new Text(-x + '', new Vector([-x,0]), size, color));
    }
    // HORIZONTAL AXIS
    for (let y = 0; y < limit.y; y += this.coordinatesDelta) {
      this.internalShapes.push(new Text(y + '', new Vector([0,y]), size, color));
      this.internalShapes.push(new Text(-y + '', new Vector([0,-y]), size, color));
    }
  }

  private onTick () {
    if (this.mouseDown && this.enableMouseMove) {
      this.translateVector = this.translateVector.add(
        this.mouseAbsolutePosition[0].subtract(this.mouseAbsolutePosition[1])
      );
    }
  }

  private onShapeUpdate (shape: Shape) {
    // skip shape if doesn't implement required function and var
    if (shape.intersectsMouse === undefined || shape.isPressed === undefined) {
      return;
    }
    const intersects = shape.intersectsMouse(this.mousePosition);
    const mouseState = this.getMouseState();
    // call onDrag function implemented by external consumer and update styles
    if (shape.isPressed) {
      const styles = call(shape.onDrag, shape, [mouseState]);
      if (styles) {
        shape.styles = { ...shape.styles, ...styles };
      }
    }
    // call onHover function implemented by external consumer and update styles
    if (intersects && !shape.isPressed) {
      const styles = call(shape.onHover, shape, [mouseState]);
      if (styles) {
        shape.styles = { ...shape.styles, ...styles };
      }
    }
    // if mouse doesn't intersects shape any more reset styles
    if (!intersects) {
      shape.styles = shape.defaultStyles;
    }
  }

  destroy () {
    this.stopRender();
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
      // calls internal update callback
      if (this.mouseAbsolutePosition) {
        this.onShapeUpdate(shape);
      }
      // calls external update callback
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