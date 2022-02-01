import Polygonizer from './polygonizer';
import Toaster, { ToastType } from './toast';
import polygonName from './util/polygon-name';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const p = new Polygonizer(canvas);
const toaster = new Toaster();

const iFile = document.getElementById('i_file') as HTMLInputElement;
const iSides = document.getElementById('i_sides') as HTMLInputElement;
const iRotation = document.getElementById('i_rotation') as HTMLInputElement;
const btnSidesPlus = document.getElementById(
  'btn_sides_plus',
) as HTMLInputElement;
const btnSidesMinus = document.getElementById(
  'btn_sides_minus',
) as HTMLInputElement;
const form = document.getElementById('form') as HTMLFormElement;

const dropzone = document.getElementById('dropzone') as HTMLButtonElement;

let filename = 'profile';

function validateValue(value: number, prevValue = -Infinity) {
  return Math.max(3, value);
}

iSides.addEventListener('input', (ev) => {
  const target = ev.currentTarget as HTMLInputElement;
  p.sides = validateValue(parseFloat(target.value), p.sides);
});

iSides.addEventListener('change', (ev) => {
  iSides.value = p.sides as any;
  btnSidesMinus.disabled = p.sides <= 3;
});

btnSidesMinus.addEventListener('click', (ev) => {
  ev.preventDefault();
  p.sides = validateValue(parseFloat(iSides.value) - 1, p.sides);
  iSides.value = p.sides as any;
  btnSidesMinus.disabled = p.sides <= 3;
  iSides.focus();
});

btnSidesPlus.addEventListener('click', (ev) => {
  ev.preventDefault();
  p.sides = validateValue(parseFloat(iSides.value) + 1, p.sides);
  iSides.value = p.sides as any;
  btnSidesMinus.disabled = p.sides <= 3;
  iSides.focus();
});

iRotation.addEventListener('change', handleRotationChange);
iRotation.addEventListener('input', handleRotationChange);
function handleRotationChange(ev: Event) {
  const rotation = parseFloat((ev.currentTarget as HTMLInputElement).value);
  p.rotation = rotation;
  [...document.querySelectorAll('[data-output="rotation"]')].forEach(
    (output) => (output.textContent = rotation.toFixed(0).replace('-', '−')),
  );
}

function imageFromFile(file: File): HTMLImageElement {
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  img.addEventListener('error', () => {
    toaster.toast(
      'Could not load image. Are you sure it’s an image file?',
      ToastType.Error,
    );
  });
  img.addEventListener('load', () => {
    document.body.classList.add('has-image');
    filename = file.name.split('.').slice(0, -1).join('.');
  });
  return img;
}

window.addEventListener('drop', (ev) => {
  ev.preventDefault();
  p.isDragging = false;
  document.body.classList.remove('is-dragging');

  for (let i = 0; i < ev.dataTransfer.items.length; i++) {
    const item = ev.dataTransfer.items[i];
    if (isImage(item)) {
      const file = item.getAsFile();
      p.image = imageFromFile(file);
      return;
    }
  }
});

window.addEventListener('dragover', (ev) => {
  ev.preventDefault();
  for (let i = 0; i < ev.dataTransfer.items.length; i++) {
    const item = ev.dataTransfer.items[i];
    if (isImage(item)) {
      p.isDragging = true;
      document.body.classList.add('is-dragging');
      return;
    }
  }
});

window.addEventListener('dragleave', () => {
  p.isDragging = false;
  document.body.classList.remove('is-dragging');
});

iFile.addEventListener('change', (ev) => {
  const target = ev.currentTarget as HTMLInputElement;
  p.image = imageFromFile(target.files[0]);
});

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  download(`${filename}.${polygonName(p.sides)}.png`);
});

dropzone.addEventListener('click', () => {
  iFile.click();
});

function download(filename = 'profile.png') {
  const a = document.createElement('a');
  a.download = filename;
  a.href = p.canvas.toDataURL('image/png');
  a.click();
}

function isImage(file: DataTransferItem): boolean {
  return file.kind === 'file' && file.type.split('/')[0] === 'image';
}
