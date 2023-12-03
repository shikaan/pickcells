import { Mask, MaskCell } from "./mask";
import { Grid, cols, forEachCell, neighbors } from "./grid";

export type Sprite = Grid<SpriteCell>

export enum SpriteCell {
  Empty,
  Border,
  Filled
}

export function makeSpriteCell(s: string): SpriteCell {
  return Number.parseInt(s, 3) as SpriteCell;
}

export const fromMask = (mask: Mask): Sprite => {
  const borderless: Grid<SpriteCell> = [];

  // Fill the grid based on mask values
  forEachCell(mask, (cell, row, col) => {
    if (col == 0) borderless.push([]);

    const width = cols(mask);
    const line = borderless[row];
    if (col >= width / 2) {
      line[col] = line[width - col - 1];
      return;
    }

    if (cell == MaskCell.AlwaysEmpty) {
      borderless[row][col] = SpriteCell.Empty;
    } else if (cell == MaskCell.AlwaysBorder) {
      borderless[row][col] = SpriteCell.Border;
    } else if (cell == MaskCell.AlwaysFilled) {
      borderless[row][col] = SpriteCell.Filled;
    } else if (cell == MaskCell.BorderOrFilled) {
      borderless[row][col] = Math.random() > 0.5 ? SpriteCell.Border : SpriteCell.Filled;
    } else if (cell == MaskCell.EmptyOrFilled) {
      borderless[row][col] = Math.random() > 0.5 ? SpriteCell.Empty : SpriteCell.Filled;
    } else {
      borderless[row][col] = SpriteCell.Empty;
    }
  });

  const result: Grid<SpriteCell> = [];

  // Draw borders around filled areas
  forEachCell(borderless, (cell, row, col) => {
    if (col == 0) result.push([]);
    result[row][col] = cell;
    if (cell != SpriteCell.Empty) return;
    const ns = neighbors(borderless, row, col);

    if (ns.some(n => n != cell && n != SpriteCell.Border)) {
      result[row][col] = SpriteCell.Border;
    }
  });

  return result;
}