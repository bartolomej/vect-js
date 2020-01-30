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
    parent.appendChild(exampleContainer);
    run(exampleContainer);
  }
}

export default loadExamples;