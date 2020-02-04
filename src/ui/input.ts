import uuid from 'uuid/v4';
import { ControlsType } from "./index";

export enum InputType {
  NUMBER = 'number',
  RANGE = 'range',
  TEXT = 'test',
  CHECKBOX = 'checkbox'
}

export interface InputProps {
  type: ControlsType;
  id?: string;
  inputType: InputType;
  label?: string;
  step?: number;
  value?: number|string;
  maxValue?: number;
  minValue?: number;
  onInput: Function;
  color?: string;
}

export default class Input {

  inputType: InputType;
  label: string;
  value: string|number;
  minValue: number;
  maxValue: number;
  onInput: Function;
  color: string;
  step: number;

  id: string;
  domElement: HTMLElement;
  inputNode: HTMLElement;

  constructor (props: InputProps) {
    this.id = props.id || uuid();
    this.inputType = props.inputType;
    this.color = props.color || '#000000';
    this.label = props.label;
    this.step = props.step || 5;
    this.value = props.value || null;
    this.onInput = props.onInput;
    this.minValue = props.minValue || 0;
    this.maxValue = props.maxValue || 100;
    this.create();
    this.inputNode.addEventListener('input', this.onInput.bind(this));
  }

  private create () {
    const container = document.createElement('div');
    container.classList.add('vect-input-container');

    // custom styles
    container.style.color = this.color;

    if (this.label) {
      const label = document.createElement('label');
      label.setAttribute('for', this.id);
      label.innerText = this.label;
      container.appendChild(label);
    }

    const input = document.createElement('input');
    input.id = this.id;
    input.type = this.inputType;
    input.step = this.step + '';
    input.value = this.value + '' || '';
    input.min = this.minValue + '' || '0';
    input.max = this.maxValue + '' || '1';
    container.appendChild(input);

    this.domElement = container;
    this.inputNode = input;
  }


}