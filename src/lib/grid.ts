export type Grid<T> = T[][];

export const size = <T>(g: Grid<T>) => {
  return g[0].length * g.length;
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

export const neighbors = <T>(g: Grid<T>, row: number, col: number) => {
  return [
    g[row]?.[col - 1],
    g[row]?.[col + 1],
    g[row - 1]?.[col],
    g[row + 1]?.[col],
  ].filter(Boolean);
}
