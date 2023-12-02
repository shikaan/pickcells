const canavs = document.getElementById('canvas') as HTMLCanvasElement;

type Grid<T> = T[][];

export const Grid = {
  size<T>(g: Grid<T>) {
    return g[0].length * g.length
  },
  fromString<T>(s: string, parser: (char: string) => T): Grid<T> {
    const lines = s.split('\n');
    return lines.map(line => {
      return line.split('').filter(i => /\d/.test(i)).map(parser)
    })
  },
  fromMaskGrid(g: Grid<MaskCell>, mirrorX = true): Grid<Cell> {
    const borderless: Grid<Cell> = []

    // Fill the grid based on mask values
    Grid.forEachCell(g, (cell, row, col) => {
      if (col == 0) borderless.push([]);

      if (mirrorX) {
        const cols = Grid.cols(g);
        const line = borderless[row];
        if (col >= cols / 2) {
          line[col] = line[cols - col - 1];
          return;
        }
      }

      if (cell == MaskCell.AlwaysEmpty) {
        borderless[row][col] = Cell.Empty;
      } else if (cell == MaskCell.AlwaysBorder) {
        borderless[row][col] = Cell.Border;
      } else if (cell == MaskCell.AlwaysFilled) {
        borderless[row][col] = Cell.Filled;
      } else if (cell == MaskCell.BorderOrFilled) {
        borderless[row][col] = Math.random() > .5 ? Cell.Border : Cell.Filled;
      } else if (cell == MaskCell.EmptyOrFilled) {
        borderless[row][col] = Math.random() > .5 ? Cell.Empty : Cell.Filled;
      } else {
        borderless[row][col] = Cell.Empty;
      }
    })

    return borderless
  },
  forEachCell<T>(grid: Grid<T>, callback: (c: T, row: number, col: number) => void) {
    const rows = grid.length;
    const cols = grid[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        callback(grid[row][col], row, col);
      }
    }
  },
  cols<T>(g: Grid<T>) {
    return g[0].length
  },
  rows<T>(g: Grid<T>) {
    return g.length
  },
}

enum Cell {
  Empty,
  Border,
  Filled
}

export function makeCell(s: string): Cell {
  return Number.parseInt(s, 3) as Cell;
}

enum MaskCell {
  AlwaysEmpty = 0,
  AlwaysBorder = 1,
  AlwaysFilled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4,
  Bounds = 5,
};

export function makeMaskCell(s: string): MaskCell {
  return Number.parseInt(s, 6) as MaskCell;
}

// The size of a single pixel, in real size
const PIXEL_SIZE = 10;
const BORDER_COLOR = "#000000";
const FILL_COLOR = "#9A9A9A";

export function draw(grid: Grid<Cell>) {
  const ctx = canavs.getContext('2d')!;

  // clean the rect
  ctx.clearRect(0, 0, canavs.width, canavs.height);

  Grid.forEachCell(grid, (cell, row, col) => {
    if (cell == Cell.Empty) return;

    ctx.fillStyle = cell == Cell.Border ? BORDER_COLOR : FILL_COLOR;

    const x = col * PIXEL_SIZE;
    const y = row * PIXEL_SIZE;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  })
}