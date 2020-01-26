import * as marked from 'marked';
import vectorField from './vector-field';
import "./style.css"

window.onload = onLoad;
let simulation: any = null;

async function onLoad () {
  const response = await fetch('https://raw.githubusercontent.com/bartolomej/vect-js/master/README.md');
  const readMe = await response.text();
  document.getElementById('docs').innerHTML = marked(readMe);
}

document.getElementById('vector-field').addEventListener('click', renderVectorField);

function renderVectorField () {
  if (!simulation) {
    simulation = vectorField();
  } else {
    simulation.destroy();
    simulation = null;
  }
}