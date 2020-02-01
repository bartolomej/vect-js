export function isParam (param: any, defaultValue: any) {
  if (param === undefined) return defaultValue;
  else return param;
}

export function getPixelRatio (ctx: CanvasRenderingContext2D) {
  let dpr = window.devicePixelRatio || 1;
  // @ts-ignore
  let bsr = ctx.webkitBackingStorePixelRatio ||
    // @ts-ignore
    ctx.mozBackingStorePixelRatio ||
    // @ts-ignore
    ctx.msBackingStorePixelRatio ||
    // @ts-ignore
    ctx.oBackingStorePixelRatio ||
    // @ts-ignore
    ctx.backingStorePixelRatio || 1;
  return dpr / bsr;
}

export function getMousePos (canvas: HTMLElement, evt: any) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

export function invertColor (hex: string, bw?: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  return "#" +
    padZero((255 - r).toString(16)) +
    padZero((255 - g).toString(16)) +
    padZero((255 - b).toString(16));

  function padZero (str: string, len = 2) {
    let zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}