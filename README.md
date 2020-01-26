# Vect

![](https://img.shields.io/npm/v/vect-js)

> vect-js library makes it easier to create interactive
> mathematical simulation or animations for the web

## Usage

Install via npm `npm i vect-js`

#### Initialization
```typescript
import vectjs, { Circle, Matrix, Vector, VectorArrow } from "vect-js";

const vect = vectjs({
    document.getElementById('container'),
    backgroundColor: '#000000',
    displayNumbers: false,
    displayBasis: false,
    displayGrid: false
});
```

#### Adding shapes
```typescript
let c = new Circle(new Vector([0, 0]), 10);
vect.addShape(c);
```

#### Space transformations
```typescript
vect.onUpdate = function () {
  this.transform(new Matrix([[0.9999, 0], [0, 0.9999]]));
}
```
## Development

1. clone repo `git clone https://github.com/bartolomej/vect && cd vect`
2. install dependencies `npm i`
3. run tests `npm test`
4. run example apps `npm start`