import vectorField from './vector-field';
import vectorOperations from './vector-operations';
import "./style.css";

const examples = [
  vectorField,
  vectorOperations
];

// @ts-ignore
window.loadExamples = loadExamples;

function loadExamples (parent?: HTMLElement) {
  for (let run of examples) {
    const exampleContainer = document.createElement('div');
    exampleContainer.classList.add('example');
    const textContainer = document.createElement('div');
    textContainer.classList.add('left');
    const title = document.createElement('h3');
    const desc = document.createElement('p');
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('right');

    // TODO: append description with live code link
    textContainer.append(title);
    exampleContainer.append(textContainer, canvasContainer);

    parent.appendChild(exampleContainer);

    const example = run(canvasContainer);
    title.innerText = example.title;
    desc.innerText = example.description;
  }
}

export default loadExamples;