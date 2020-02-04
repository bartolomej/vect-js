import Input, { InputProps } from "./input";
import Button, { ButtonProps } from "./button";
import { ControlsType } from "./index";

export enum Position {
  LEFT,
  RIGHT
}

export interface ControlsProps {
  color?: string;
  position?: Position;
}

export default class Controls {

  domElement: HTMLElement;
  elements: Array<any>;
  color: string;
  position: Position;

  constructor (inputs: Array<InputProps|ButtonProps>, props?: ControlsProps) {
    this.elements = [];
    this.position = props.position;
    this.color = props.color || '#00000';
    for (let i of inputs) {
      if (!i.color) {
        // if color not set explicitly inherit from controls
        i = { ...i, color: this.color };
      }
      if (i.type === ControlsType.BUTTON) {
        // @ts-ignore
        this.elements.push(new Button(i));
      } else if (i.type === ControlsType.INPUT) {
        // @ts-ignore
        this.elements.push(new Input(i));
      }
    }
    this.create();
  }

  private create () {
    const styleContainer = document.createElement('style');
    styleContainer.innerHTML = styles(this.position);
    document.body.appendChild(styleContainer);

    const container = document.createElement('div');
    container.classList.add('vect-controls-container');

    for (let ele of this.elements) {
      container.appendChild(ele.domElement);
    }

    this.domElement = container;
  }

  append (container: HTMLElement) {
    container.style.position = 'relative';
    container.appendChild(this.domElement);
  }

}

function styles (position: Position) {
  return `
  .vect-input-container {
      font-family: monospace;
      display: flex;
      flex-direction: column;
      margin: 5px;
  }
  
  button.vect-btn {
      outline: none;
      cursor: pointer;
      background: none;
      border-radius: 10px;
      border: 2px solid black;
      padding: 5px 0;
      margin: 5px;
      font-weight: bold;
  }
  
  .vect-controls-container {
      padding: 5px;
      border: 2px solid white;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 10px;
      ${position === Position.LEFT ? 'left' : 'right'}: 10px;
  }
`
}