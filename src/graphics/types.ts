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
}

export interface Shape {
  drawCanvas: DrawFunction;
  onUpdate: UpdateFunction;
  position: Vector;
  state: Object;
  // add style prop for declarative style updates in the future
}

export interface DrawFunction {
  (ctx: CanvasRenderingContext2D): void;
}

export interface UpdateFunction {
  (t: number): void;
}