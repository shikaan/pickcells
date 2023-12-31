export type Grid<T> = T[][];

export const make = <T>(rows: number, cols: number, empty: T): Grid<T> => {
  const result = []

  for (let row = 0; row < rows; row++) {
    result[row] = [] as T[];
    for (let col = 0; col < cols; col++) {
      result[row][col] = empty;
    }
  }

  return result
}

export const size = <T>(g: Grid<T>) => {
  return (g[0]?.length ?? 0) * g.length;
}

export const fromString = <T>(s: string, parser: (char: string) => T): Grid<T> => {
  const lines = s.split('\n');
  return lines.map(line => {
    return line.split('').filter(i => /\d/.test(i)).map(parser);
  });
}

export const forEachCell = <T>(grid: Grid<T>, callback: (c: T, row: number, col: number) => void) => {
  for (let row = 0; row < rows(grid); row++) {
    for (let col = 0; col < cols(grid); col++) {
      callback(grid[row][col], row, col);
    }
  }
}

export const cols = <T>(g: Grid<T>) => {
  return g[0].length;
}

export const rows = <T>(g: Grid<T>) => {
  return g.length;
}

export const isEmpty = <T>(g: Grid<T>, emptyCell: T) => {
  if (size(g) == 0) return true;

  let empty = true;
  forEachCell(g, (c) => {
    if (c != emptyCell) {
      empty = false;
    }
  });

  return empty;
}

export const neighbors = <T>(g: Grid<T>, row: number, col: number) => {
  return [
    g[row]?.[col - 1],
    g[row]?.[col + 1],
    g[row - 1]?.[col],
    g[row + 1]?.[col],
  ].filter(Boolean);
}
