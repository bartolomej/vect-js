import Input, { InputProps } from "./input";
import Button, { ButtonProps } from "./button";
import { ControlsType } from "./index";


export interface ControlsProps {
  color?: string;
}

export default class Controls {

  domElement: HTMLElement;
  elements: Array<any>;
  color: string;

  constructor (inputs: Array<InputProps|ButtonProps>, props?: ControlsProps) {
    this.elements = [];
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
    const container = document.createElement('div');
    container.classList.add('vect-controls-container');

    for (let ele of this.elements) {
      container.appendChild(ele.domElement);
    }

    this.domElement = container;
  }

}