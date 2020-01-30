import "./index.css";
import { ControlsType } from "./index";

export interface ButtonProps {
  type: ControlsType;
  text?: string;
  image?: HTMLImageElement;
  color?: string;
  onClick: Function;
}

export default class Button {

  text: string;
  color: string;
  onClick: Function;

  domElement: HTMLElement;
  textNode: Text;
  imageNode: HTMLImageElement;

  constructor (props: ButtonProps) {
    this.text = props.text || null;
    this.color = props.color;
    this.onClick = props.onClick;
    this.imageNode = props.image || null;
    this.create();
  }

  private create () {
    const button = document.createElement('button');
    button.classList.add('vect-btn');

    button.style.color = this.color;
    button.style.borderColor = this.color;

    if (this.imageNode) {
      button.appendChild(this.imageNode);
    }
    if (this.text) {
      this.textNode = document.createTextNode(this.text);
      button.appendChild(this.textNode);
    }
    this.domElement = button;
    this.domElement.addEventListener('click', this.onClick.bind(this));
  }

  setText (text: string) {
    this.textNode.nodeValue = text;
  }

  setImage (img: HTMLImageElement) {
    this.domElement.replaceChild(img, this.imageNode);
  }

  appendTo (element: HTMLElement) {
    element.appendChild(this.domElement);
  }

}