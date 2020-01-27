# vect-js

![](https://img.shields.io/npm/v/vect-js)

Easily create interactive mathematical simulation or animations for the web.
<br>
WARNING! This library is still in early development and is not only for experimental and testing usage.

## Demo

- [Vector field](https://bartolomej.github.io/vector-field/)

## Installing

```bash
npm i vect-js
```

## Using 

Minimal example rendering two vectors and their sum.
```typescript
import Vect from "vect-js";

// tell vect where to render ui
const vectContainer = document.body;

const vect = new Vect({
    container: vectContainer,
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false,
    enableMouseMove: true
});

// starting position of vector arrow (default 0,0)
const p0 = new Vector([0,0]);

const v1 = new VectorArrow(p0, new Vector([100,50]), '#FFFFFF');
const v2 = new VectorArrow(p0, new Vector([50,100]), '#FFFFFF');
const sum1 = new VectorArrow(p0, v1.vector.add(v2.vector), '#db002f');

// add shapes to render
vect.addShapes([v1,v2,sum1]);
```

#### Updating shapes
```typescript
import { Circle, VectorArrow } from 'vect-js';

// initialize with position and radius
let circle = new Circle(new Vector([0, 0]), 10);

// on render update callback
circle.onUpdate = function () {
  // update position with velocity vector
  this.position = this.position.add(new Vector([10,10]));
}
```

#### Updating coordinate system
```typescript
vect.onUpdate = function () {

  // translate coordinates
  this.translate(new Vector([10, 100]));

  // transform coordinates (zoom, skew)
  this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
}

```
## Development

1. clone repo `git clone https://github.com/bartolomej/vect && cd vect`
2. install dependencies `npm i`
3. run tests `npm test`
4. run example apps `npm start`