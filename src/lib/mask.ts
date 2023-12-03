import { Grid } from "./grid";

export enum MaskCell {
  AlwaysEmpty = 0,
  AlwaysBorder = 1,
  AlwaysFilled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4,
  Bounds = 5
}

export function makeMask(s: string): MaskCell {
  return Number.parseInt(s, 6) as MaskCell;
}

export type Mask = Grid<MaskCell>; 