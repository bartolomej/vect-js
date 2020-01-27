import marked from 'marked';
import runExamples from '../examples/index';
// @ts-ignore
import { highlightBlock } from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css"
import "./style.css"

window.addEventListener('load', onLoad);
document.getElementById('docs-btn').addEventListener('click', onDocsBtn);
document.getElementById('examples-btn').addEventListener('click', onExamplesBtn);

let examples;
let docs;

async function onLoad () {
  docs = document.createElement('div');
  docs.id = 'docs-container';
  examples = document.createElement('div');
  examples.id = 'examples-container';

  const response = await fetch('https://raw.githubusercontent.com/bartolomej/vect-js/master/README.md');
  const readMe = await response.text();
  docs.innerHTML = marked(readMe);
  docs.querySelectorAll('pre').forEach((block) => {
    block.classList.add('javascript');
    highlightBlock(block);
  });

  document.body.appendChild(docs);
}

function onDocsBtn () {
  animateAllCanvas(examples);

  document.body.style.background = 'white';
  document.body.style.color = 'black';
  examples.style.color = 'black';

  document.body.removeChild(examples);
  document.body.appendChild(docs);
}

function onExamplesBtn () {
  document.body.style.background = 'black';
  document.body.style.color = 'whites';
  examples.style.transition = '1s ease';
  examples.style.color = 'white';

  document.body.removeChild(docs);
  document.body.appendChild(examples);

  if (!canvasExists(examples)) {
    runExamples(examples);
  }
  setTimeout(() => animateAllCanvas(examples), 800)
}

function animateAllCanvas (element) {
  element.querySelectorAll('canvas')
    .forEach(c => {
      if (c.classList.contains('fade-up')) {
        c.classList.remove('fade-up');
      } else {
        c.classList.add('fade-up');
      }
    })
}

function canvasExists (element) {
  return element.querySelectorAll('canvas').length > 0;
}