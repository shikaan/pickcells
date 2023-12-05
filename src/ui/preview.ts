import { forEachCell } from "../lib/grid";
import { SpriteCell } from "../lib/sprite";
import { InitialState, State } from "./state";
import { template } from "./utils";

const PIXEL_SIZE = 10;
const BORDER_COLOR = "#000000";

export class Preview {
  template = template('<canvas></canvas>')
  private readonly canvas: HTMLCanvasElement;

  constructor(
    private state: State<InitialState>
  ) {
    this.canvas = this.template.create() as HTMLCanvasElement
  }

  render() {
    return this.canvas
  }

  update() {
    const ctx = this.canvas.getContext('2d')!;

    // clean the rect
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    forEachCell(this.state.get('sprite'), (cell, row, col) => {
      if (cell == SpriteCell.Empty) return;

      ctx.fillStyle = cell == SpriteCell.Border ? BORDER_COLOR : this.state.get('color');

      const x = col * PIXEL_SIZE;
      const y = row * PIXEL_SIZE;
      ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    })
  }
}