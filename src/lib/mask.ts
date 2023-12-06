import { Grid } from "./grid";

export enum MaskCell {
  AlwaysEmpty = 0,
  AlwaysBorder = 1,
  AlwaysFilled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4
}

export const MaskCellValues = [
  MaskCell.AlwaysBorder,
  MaskCell.AlwaysFilled,
  MaskCell.BorderOrFilled,
  MaskCell.EmptyOrFilled,
  MaskCell.AlwaysEmpty,
]

export const NUMBER_OF_STATES = MaskCellValues.length;

export function makeMask(s: string): MaskCell {
  return Number.parseInt(s, NUMBER_OF_STATES) as MaskCell;
}

export type Mask = Grid<MaskCell>; 