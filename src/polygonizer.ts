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

  private _size = 400;
  public get size() {
    return this._size;
  }
  public set size(value) {
    this._size = value;
    this.render();
  }

  private _isDragging = false;
  public get isDragging() {
    return this._isDragging;
  }
  public set isDragging(value) {
    this._isDragging = value;
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
    const w = this.size;
    const h = this.size;
    const sides = this.sides;
    const rot = ((this.rotation + 90) / 180) * Math.PI;
    const imageIsLoaded = Boolean(this.image?.width);

    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);

    function drawEllipse(m: number, n: number, scale = 1) {
      ctx.beginPath();
      const nSamples = 1000;
      const rMax = ellipse(0.5 * ((2 * Math.PI) / m), m, n);
      for (let i = 0; i < nSamples; i += 1) {
        const phi = (i / nSamples) * Math.PI * 2;
        const r = ellipse(phi, m, n);
        const x = (r / rMax) * Math.cos(phi + rot) * (w / 2) * scale;
        const y = (r / rMax) * Math.sin(phi + rot) * (h / 2) * scale;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    }

    const n = 0.23 * sides ** 2 - 0.14 * sides + 0.76;
    drawEllipse(sides, n);
    ctx.fillStyle = imageIsLoaded ? '#fff' : 'rgba(255, 255, 255, 0.6)';
    ctx.fill();

    ctx.resetTransform();
    if (imageIsLoaded) {
      ctx.globalCompositeOperation = 'source-in';
      const scale = this.size / Math.min(this.image.width, this.image.height);

      ctx.translate(
        (this.size - this.image.width * scale) / 2,
        (this.size - this.image.height * scale) / 2,
      );
      // Using scale rather than the dw/dh parameters to drawImage() seems to
      // lead to better interpolation in Firefox
      ctx.scale(scale, scale);

      ctx.drawImage(
        this.image,
        0,
        0,
        this.image.width,
        this.image.height,
        0,
        0,
        this.image.width,
        this.image.height,
      );
      ctx.resetTransform();
    }

    if (this.isDragging) {
      ctx.globalCompositeOperation = 'difference';
      ctx.translate(w / 2, h / 2);
      drawEllipse(sides, n, 0.95);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(127, 127, 127, 0.5)';
      ctx.setLineDash([20, 15]);
      ctx.stroke();
    }
  }
}

function ellipse(phi: number, m: number, n: number): number {
  return Math.pow(
    Math.abs(Math.cos((m * phi) / 4)) ** 4 +
      Math.abs(Math.sin((m * phi) / 4)) ** 4,
    -1 / n,
  );
}
