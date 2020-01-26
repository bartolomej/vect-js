import * as marked from 'marked';
import vectorField from './vector-field';
// @ts-ignore
import { highlightBlock } from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css"
import "./style.css"

window.onload = onLoad;
let simulation: any = null;

async function onLoad () {
  const response = await fetch('https://raw.githubusercontent.com/bartolomej/vect-js/master/README.md');
  const readMe = await response.text();
  document.getElementById('docs').innerHTML = marked(readMe);
  document.querySelectorAll('pre').forEach((block) => {
    block.classList.add('javascript');
    highlightBlock(block);
  });
  renderVectorField();
}

//document.getElementById('vector-field').addEventListener('click', renderVectorField);

function renderVectorField () {
  if (!simulation) {
    simulation = vectorField();
  } else {
    simulation.destroy();
    simulation = null;
  }
}