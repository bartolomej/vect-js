import Vector from "../math/vector";

export interface RenderProps {
  container: HTMLElement;
  width?: number;
  height?: number;
  backgroundColor?: string;
  coordinatesDelta?: number;
  displayBasis?: boolean;
  displayGrid?: boolean;
  displayNumbers?: boolean;
  enableMouseMove?: boolean;
  highPixelDensity?: boolean;
  pixelRatioFactor?: number;
}

export interface Shape {
  drawCanvas: DrawFunction;
  onUpdate: UpdateFunction;
  update?: MouseCallback; // called by renderer
  onHover?: MouseCallback;
  onClick?: MouseCallback;
  onDrag?: MouseCallback;
  position: Vector;
  state: Object;
  // add style prop for declarative style updates in the future
}

export interface MouseCallback {
  (m: MouseState): void;
}

export interface MouseState {
  position: Vector;
  absolutePosition: Vector;
  isDown: boolean;
}

export interface DrawFunction {
  (ctx: CanvasRenderingContext2D): void;
}

export interface UpdateFunction {
  (t: number): void;
}