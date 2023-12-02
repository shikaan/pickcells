import { draw, Grid, makeCell, makeMaskCell } from './draw';

const form = document.getElementById('testing');
const grid = document.getElementById('grid') as HTMLInputElement;
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

  // const maskCellZero = mask.value.split('').filter(i => /\d/.test(i)).map(makeMaskCell);
  const x = Number.parseInt(sizeX.value, 10);
  const y = Number.parseInt(sizeY.value, 10);
  // const g = Grid.fromString(grid.value, makeCell);
  const g = Grid.fromString(mask.value, makeMaskCell);

  // console.log(g)

  // check size

  // const grid = makeGridFromMaskGrid([maskCellZero, [x, y]]);

  try {
    draw(Grid.fromMaskGrid(g))
    // draw(g)
  } catch (e: any) {
    alert(e.message);
  }
})