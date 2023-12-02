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
  neighbors<T>(g: Grid<T>, row: number, col: number) {
    return [
      g[row]?.[col - 1],
      g[row]?.[col + 1],
      g[row - 1]?.[col],
      g[row + 1]?.[col],
    ].filter(Boolean)
  }
}

export const PixelGrid = {
  fromMaskGrid(g: Grid<Mask>): Grid<Pixel> {
    const borderless: Grid<Pixel> = []

    // Fill the grid based on mask values
    Grid.forEachCell(g, (cell, row, col) => {
      if (col == 0) borderless.push([]);

      const cols = Grid.cols(g);
      const line = borderless[row];
      if (col >= cols / 2) {
        line[col] = line[cols - col - 1];
        return;
      }

      if (cell == Mask.AlwaysEmpty) {
        borderless[row][col] = Pixel.Empty;
      } else if (cell == Mask.AlwaysBorder) {
        borderless[row][col] = Pixel.Border;
      } else if (cell == Mask.AlwaysFilled) {
        borderless[row][col] = Pixel.Filled;
      } else if (cell == Mask.BorderOrFilled) {
        borderless[row][col] = Math.random() > .5 ? Pixel.Border : Pixel.Filled;
      } else if (cell == Mask.EmptyOrFilled) {
        borderless[row][col] = Math.random() > .5 ? Pixel.Empty : Pixel.Filled;
      } else {
        borderless[row][col] = Pixel.Empty;
      }
    })

    const result: Grid<Pixel> = []

    // Draw borders around filled areas
    Grid.forEachCell(borderless, (cell, row, col) => {
      if (col == 0) result.push([]);
      result[row][col] = cell;
      if (cell != Pixel.Empty) return;
      const neighbors = Grid.neighbors(borderless, row, col);

      if (neighbors.some(n => n != cell && n != Pixel.Border)) {
        result[row][col] = Pixel.Border;
      }
    })

    return result
  },
}

enum Pixel {
  Empty,
  Border,
  Filled
}

export function makePixel(s: string): Pixel {
  return Number.parseInt(s, 3) as Pixel;
}

enum Mask {
  AlwaysEmpty = 0,
  AlwaysBorder = 1,
  AlwaysFilled = 2,
  BorderOrFilled = 3,
  EmptyOrFilled = 4,
  Bounds = 5,
};

export function makeMask(s: string): Mask {
  return Number.parseInt(s, 6) as Mask;
}

// The size of a single pixel, in real size
const PIXEL_SIZE = 10;
const BORDER_COLOR = "#000000";
const FILL_COLOR = "#9A9A9A";

export function draw(pixelGrid: Grid<Pixel>) {
  const ctx = canavs.getContext('2d')!;

  // clean the rect
  ctx.clearRect(0, 0, canavs.width, canavs.height);

  Grid.forEachCell(pixelGrid, (cell, row, col) => {
    if (cell == Pixel.Empty) return;

    ctx.fillStyle = cell == Pixel.Border ? BORDER_COLOR : FILL_COLOR;

    const x = col * PIXEL_SIZE;
    const y = row * PIXEL_SIZE;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  })
}