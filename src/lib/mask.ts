import { Grid } from "./grid";

export enum MaskCell {
  Empty = 0,
  Border = 1,
  Filled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4
}

export const MaskCellValues = [
  MaskCell.Border,
  MaskCell.Filled,
  MaskCell.BorderOrFilled,
  MaskCell.EmptyOrFilled,
  MaskCell.Empty,
]

export const NUMBER_OF_STATES = MaskCellValues.length;

export function makeMask(s: string): MaskCell {
  return Number.parseInt(s, NUMBER_OF_STATES) as MaskCell;
}

export type Mask = Grid<MaskCell>; 