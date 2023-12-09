import './preview.css'
import { cols, forEachCell, isEmpty, rows } from "../lib/grid";
import { Sprite, SpriteCell, fromMask } from "../lib/sprite";
import { InitialState, State } from "./state";
import { template } from "./utils";
import { MaskCell } from '../lib/mask';

const PIXEL_SIZE = 8;
// Same as --color-black
const BORDER_COLOR = '#212529';

export class Preview {
  template = template(`<div class="preview"></div>`)
  canvas = template('<canvas class="sprite"></canvas>')
  emptyState = template(`
  <section class="nes-container empty-state">
    <span class="icon with-border">!</span>
    <p>Draw a mask and click "Generate" to start</p>
  </section>
  `)

  private readonly $root: HTMLDivElement;
  private sprites: Sprite[];

  constructor(
    private state: State<InitialState>
  ) {
    this.sprites = [];
    this.$root = this.template.create() as HTMLDivElement;
    this.state.onPropertyChange('color', this.refresh.bind(this))
  }

  render() {
    this.$root.innerHTML = '';
    this.sprites = [];

    const previews = this.state.get('previewCount');
    const mask = this.state.get('mask');

    if (isEmpty(mask, MaskCell.AlwaysEmpty)) {
      this.$root.appendChild(this.emptyState.create());
      return this.$root;
    }

    for (let i = 0; i < previews; i++) {
      const sprite = fromMask(mask);
      this.sprites.push(sprite);
      this.$root.appendChild(this.drawSprite(sprite));
    }

    this.$root.style.setProperty('--sprite-width', `${cols(this.sprites[0]) * PIXEL_SIZE}px`);

    return this.$root;
  }

  private refresh() {
    this.$root.innerHTML = '';

    for (const sprite of this.sprites) {
      this.$root.appendChild(this.drawSprite(sprite));
    }
  }

  private drawSprite(sprite: Sprite): HTMLCanvasElement {
    const canvas = this.canvas.create() as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = cols(sprite) * PIXEL_SIZE;
    canvas.height = rows(sprite) * PIXEL_SIZE;

    forEachCell(sprite, (cell, row, col) => {
      if (cell == SpriteCell.Empty) return;

      ctx.fillStyle = cell == SpriteCell.Border ? BORDER_COLOR : this.state.get('color');

      const x = col * PIXEL_SIZE;
      const y = row * PIXEL_SIZE;
      ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });

    return canvas;
  }
}