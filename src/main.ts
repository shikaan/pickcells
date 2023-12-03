import { draw } from './canvas';
import { makeMask } from "./lib/mask";
import { fromString } from "./lib/grid";
import { fromMask } from './lib/sprite';

const form = document.getElementById('testing');
const maskEl = document.getElementById('mask') as HTMLTextAreaElement;
const sizeX = document.getElementById('sizeX') as HTMLInputElement;
const sizeY = document.getElementById('sizeY') as HTMLInputElement;
const canavs = document.getElementById('canvas') as HTMLCanvasElement;

sizeX.addEventListener('change', (e) => {
  maskEl.cols = Number.parseInt(sizeX.value, 10);
})

sizeY.addEventListener('change', (e) => {
  maskEl.rows = Number.parseInt(sizeY.value, 10);
})

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const mask = fromString(maskEl.value, makeMask);
  const sprite = fromMask(mask);

  try {
    draw(sprite, canavs)
  } catch (e: any) {
    alert(e.message);
  }
})