# Vect.js

![](https://img.shields.io/npm/v/vect-js)

> vect-js library makes it easier to create interactive
> mathematical simulation or animations for the web

## Usage

Install via npm `npm i vect-js`

#### Initialization
```typescript
import Vect from "vect-js";

const vect = Vect({
    document.getElementById('container'),
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
});
```

#### Abstract math objects
```typescript
import { Matrix, Vector } from 'vect-js'

let v1 = new Vector([1, 1, 2]);
let v2 = new Vector([1, 3, 2]);

v1.add(v2); // [2, 4, 4]
```


#### Rendering shapes
```typescript
import { Circle, VectorArrow } from 'vect-js';

// initialize with position and radius
let circle = new Circle(new Vector([0, 0]), 10);

// on render update callback
circle.onUpdate = function () {
  // add velocity to position
  this.position = this.position.add(new Vector([10,10]));
}

// add shape to rendering context
vect.addShape(circle);
```

#### Rendering updates
```typescript
vect.onUpdate = function () {

  // translate canvas
  this.translate(new Vector([10, 100]));

  // transform canvas (zoom, skew)
  this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
}
```
## Development

1. clone repo `git clone https://github.com/bartolomej/vect && cd vect`
2. install dependencies `npm i`
3. run tests `npm test`
4. run example apps `npm start`