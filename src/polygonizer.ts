export default class Polygonizer {
  private _sides = 5;
  public get sides() {
    return this._sides;
  }
  public set sides(value) {
    this._sides = value;
    this.render();
  }

  private _rotation = 0;
  public get rotation() {
    return this._rotation;
  }
  public set rotation(value) {
    this._rotation = value;
    this.render();
  }

  private _width = 400;
  public get width() {
    return this._width;
  }
  public set width(value) {
    this._width = value;
    this.render();
  }

  private _height = 400;
  public get height() {
    return this._height;
  }
  public set height(value) {
    this._height = value;
    this.render();
  }

  private _image: HTMLImageElement | null = null;
  public get image(): HTMLImageElement | null {
    return this._image;
  }
  public set image(value: HTMLImageElement | null) {
    this._image = value;
    this.render();
    if (value) {
      value.addEventListener('load', this.render.bind(this), { once: true });
    }
  }

  constructor(public canvas: HTMLCanvasElement) {
    this.render();
  }

  render() {
    const w = this.width;
    const h = this.height;
    const sides = this.sides;
    const rot = ((this.rotation + 90) / 180) * Math.PI;

    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);

    function drawEllipse(m: number, n: number) {
      ctx.beginPath();
      const nSamples = 1000;
      const rMax = ellipse(0.5 * ((2 * Math.PI) / m), m, n);
      for (let i = 0; i < nSamples; i += 1) {
        const phi = (i / nSamples) * Math.PI * 2;
        const r = ellipse(phi, m, n);
        const x = (r / rMax) * Math.cos(phi + rot) * (w / 2);
        const y = (r / rMax) * Math.sin(phi + rot) * (h / 2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    }

    drawEllipse(sides, 0.23 * sides ** 2 - 0.14 * sides + 0.76);
    ctx.fillStyle = '#ccc';
    ctx.fill();

    if (this.image) {
      ctx.resetTransform();
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(this.image, 0, 0, w, h);
    }
  }
}

function ellipse(phi: number, m: number, n: number): number {
  return Math.pow(
    Math.abs(Math.cos((m * phi) / 4)) ** 4 +
      Math.abs(Math.sin((m * phi) / 4)) ** 4,
    -1 / n
  );
}
