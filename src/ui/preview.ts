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
    <p>Draw a mask and click <em>Generate</em> to start</p>
  </section>
  `)

  private readonly $root: HTMLDivElement;
  private $sprite?: HTMLCanvasElement;
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

    this.$sprite = undefined;
    for (let i = 0; i < previews; i++) {
      const sprite = fromMask(mask, { drawBorders: this.state.get('drawBorders') });
      this.sprites.push(sprite);
      const canvas = this.drawSprite(sprite);
      this.$sprite ||= canvas;
      this.$root.appendChild(canvas);
    }

    this.$root.style.setProperty('--sprite-width', `${cols(this.sprites[0]) * PIXEL_SIZE}px`);

    return this.$root;
  }

  getSprite(): HTMLCanvasElement | undefined {
    return this.$sprite;
  }

  private refresh() {
    this.$root.innerHTML = '';
    this.$sprite = undefined;

    for (const sprite of this.sprites) {
      const canvas = this.drawSprite(sprite);
      this.$sprite ||= canvas;
      this.$root.appendChild(canvas);
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