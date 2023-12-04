import { Grid } from "./grid";

export enum MaskCell {
  AlwaysEmpty = 0,
  AlwaysBorder = 1,
  AlwaysFilled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4
}

export const NUMBER_OF_STATES = Object.keys(MaskCell).length / 2;

export function makeMask(s: string): MaskCell {
  return Number.parseInt(s, NUMBER_OF_STATES) as MaskCell;
}

export type Mask = Grid<MaskCell>; 