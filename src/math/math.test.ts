import Vector from "./vector";
import Matrix from "./matrix";


describe('Test vector class', function () {

  it('should calculate absolute value', function () {
    let v = new Vector([1,1,1,2]);
    expect(v.abs()).toBe(Math.sqrt(7));
  });

  it('should sum two vectors of equal dimension', function () {
    let v1 = new Vector([1,1,2]);
    let v2 = new Vector([1,3,2]);
    expect(v1.add(v2)).toEqual(new Vector([2,4,4]));
  });

  it('should not sum two vectors of non-equal dimensions', function () {
    let v1 = new Vector([1,1,2]);
    let v2 = new Vector([1,2,2,1]);
    expect(v1.add(v2)).toEqual(undefined);
  });

  it('should subtract two vectors of same dimension', function () {
    let v1 = new Vector([1,1,2]);
    let v2 = new Vector([-1,3,2]);
    expect(v1.subtract(v2)).toEqual(new Vector([2, -2, 0]));
  });

  it('should calculate dot product', function () {
    let v1 = new Vector([1,0,0]);
    let v2 = new Vector([0,1,0]);
    expect(v1.dotProduct(v2)).toBe(0);
  });

  it('should calculate scalar product', function () {
    let v1 = new Vector([1,2,3]);
    expect(v1.scalarProduct(2)).toEqual(new Vector([2,4,6]));
  });

});


describe('Test matrix class', function () {

  it('should initialize matrix by array', function () {
    let m1 = new Matrix([[1,0], [0,1]]);
    expect(m1).toEqual(new Matrix([
      new Vector([1,0]),
      new Vector([0,1])
    ]))
  });

  it('should add unit matrices', function () {
    let m1 = new Matrix([
      new Vector([1,0,0]),
      new Vector([0,1,0]),
      new Vector([0,0,1])
    ]);
    let m2 = new Matrix([
      new Vector([1,0,0]),
      new Vector([0,1,0]),
      new Vector([0,0,1])
    ]);
    expect(m1.add(m2)).toEqual(new Matrix([
      new Vector([2,0,0]),
      new Vector([0,2,0]),
      new Vector([0,0,2])
    ]));
  });

  it('should multiply matrix - scalar', function () {
    let m1 = new Matrix([
      new Vector([1,0,0]),
      new Vector([0,2,0]),
      new Vector([0,0,1])
    ]);
    expect(m1.scalarProduct(2)).toEqual(new Matrix([
      new Vector([2,0,0]),
      new Vector([0,4,0]),
      new Vector([0,0,2])
    ]));
  });

  it('should multiply matrix - vector', function () {
    let m1 = new Matrix([
      new Vector([1,0,0]),
      new Vector([0,1,0]),
      new Vector([0,0,1])
    ]);
    let v1 = new Vector([1,2,3]);
    expect(m1.vectorProduct(v1)).toEqual(new Vector([1,2,3]));
  });

  it('should multiply matrix - matrix', function () {
    let m1 = new Matrix([
      new Vector([1,0,0]),
      new Vector([0,1,0]),
      new Vector([0,0,1])
    ]);
    let m2 = new Matrix([
      new Vector([2,0,0]),
      new Vector([0,3,0]),
      new Vector([0,0,4])
    ]);
    expect(m1.matrixProduct(m2)).toEqual(new Matrix([
      new Vector([2,0,0]),
      new Vector([0,3,0]),
      new Vector([0,0,4])
    ]))
  });

});