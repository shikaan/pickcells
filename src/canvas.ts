import { forEachCell } from "./lib/grid";
import { Sprite, SpriteCell } from "./lib/sprite";

// The size of a single pixel, in real size
const PIXEL_SIZE = 10;
const BORDER_COLOR = "#000000";
const FILL_COLOR = "#9A9A9A";

export function draw(sprite: Sprite, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;

  // clean the rect
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  forEachCell(sprite, (cell, row, col) => {
    if (cell == SpriteCell.Empty) return;

    ctx.fillStyle = cell == SpriteCell.Border ? BORDER_COLOR : FILL_COLOR;

    const x = col * PIXEL_SIZE;
    const y = row * PIXEL_SIZE;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  })
}