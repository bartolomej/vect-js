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

  getAbsoluteTransform () {
    return this.transformZero.matrixProduct(this.transformMatrix);
  }

  getAbsoluteTranslate () {
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
    const zoomRate = rate || 1.0001;
    this.transform(new Matrix([[1/zoomRate, 0], [0, 1/zoomRate]]));
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

  getMouseState (): MouseState {
    return {
      isDown: this.mouseDown,
      absolutePosition: this.mouseAbsolutePosition[0],
      position: this.mousePosition
    }
  }

  // returns max top-left, bottom-right coordinate visible on canvas
  getBoundaries () {
    let v0 = new Vector([this.canvas.width/2, this.canvas.height/2]);
    let v1 = new Vector([this.canvas.width/2, this.canvas.height/2]);
    let b0 = this.transformMatrix.inverse2D().vectorProduct(v0.add(this.translateVector).scalarProduct(-1));
    let b1 = this.transformMatrix.inverse2D().vectorProduct(v1.subtract(this.translateVector));
    return [
      new Vector([b0.x, -b0.y]),
      new Vector([b1.x, -b1.y]),
    ]
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
    const translated = abs.subtract(this.getAbsoluteTranslate());
    this.mousePosition = this.getAbsoluteTransform().inverse2D().vectorProduct(translated);
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
    const [topLeft, bottomRight] = this.getBoundaries();
    this.ctx.beginPath();
    this.ctx.strokeStyle = invertColor(this.backgroundColor);
    this.ctx.lineWidth = 2;
    // VERTICAL BASIS (x = 0)
    line(this.ctx, new Vector([0, topLeft.y]), new Vector([0, bottomRight.y]));
    // HORIZONTAL BASIS (y = 0)
    line(this.ctx, new Vector([topLeft.x, 0]), new Vector([bottomRight.x, 0]));
    this.ctx.stroke();
  }

  private drawGrid () {
    const [topLeft, bottomRight] = this.getBoundaries();
    const delta = this.coordinatesDelta;
    const color = invertColor(this.backgroundColor);
    this.ctx.beginPath();
    this.ctx.strokeStyle = color + '80';
    this.ctx.lineWidth = 1;
    // VERTICAL LINES
    for (let x = topLeft.x - (topLeft.x % delta); x <= bottomRight.x - (bottomRight.x % delta); x += delta) {
      line(this.ctx,
        new Vector([x, topLeft.y]),
        new Vector([x, bottomRight.y])
      );
      if (this.displayNumbers) {
        this.internalShapes.push(new Text(x + '', new Vector([x,0]), 15, color));
      }
    }
    // HORIZONTAL LINES
    for (let y = topLeft.y - (topLeft.y % delta); y >= bottomRight.y - (bottomRight.y % delta); y -= delta) {
      line(this.ctx,
        new Vector([topLeft.x, y]),
        new Vector([bottomRight.x, y])
      );
      if (this.displayNumbers) {
        this.internalShapes.push(new Text(y + '', new Vector([0,-y]), 15, color));
      }
    }
    this.ctx.stroke();
  }

  private onTick () {
    // TODO: fix mouse translation
    if (this.mouseDown && this.enableMouseMove) {
      this.translateVector = this.translateVector.add(
        this.mouseAbsolutePosition[0].subtract(this.mouseAbsolutePosition[1]).scalarProduct(0.6)
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

    const m = this.getAbsoluteTransform();
    const t = this.getAbsoluteTranslate();
    this.ctx.transform(m.x.x, m.x.y, m.y.x, m.y.y, t.x, t.y);

    // draw coordinates
    if (this.displayGrid) this.drawGrid();
    if (this.displayBasis) this.drawBasis();

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

    this.ticker += 1/60;
    this.animationFrame = requestAnimationFrame(this.render.bind(this));
  }

}

function line (ctx: any, p0: Vector, p1: Vector) {
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
}