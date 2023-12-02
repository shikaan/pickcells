import { draw, Grid, makeMask, PixelGrid } from './draw';

const form = document.getElementById('testing');
const mask = document.getElementById('mask') as HTMLTextAreaElement;
const sizeX = document.getElementById('sizeX') as HTMLInputElement;
const sizeY = document.getElementById('sizeY') as HTMLInputElement;

sizeX.addEventListener('change', (e) => {
  mask.cols = Number.parseInt(sizeX.value, 10);
  // mask.maxLength = Number.parseInt(sizeX.value, 10) * Number.parseInt(sizeY.value, 10);
})

sizeY.addEventListener('change', (e) => {
  mask.rows = Number.parseInt(sizeY.value, 10);
  // mask.maxLength = Number.parseInt(sizeX.value, 10) * Number.parseInt(sizeY.value, 10);
})

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const x = Number.parseInt(sizeX.value, 10);
  const y = Number.parseInt(sizeY.value, 10);
  const maskGrid = Grid.fromString(mask.value, makeMask);
  const pixelGrid = PixelGrid.fromMaskGrid(maskGrid);

  // check size

  try {
    draw(pixelGrid)
  } catch (e: any) {
    alert(e.message);
  }
})