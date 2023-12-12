import './mask.css'
import { MaskCell as MaskCellType } from "../lib/mask";
import { template, toNumber } from "./utils";
import { InitialState, State } from './state';
import { forEachCell, make } from '../lib/grid';

const ZOOM_LEVELS = ['0.5', '0.75', '1', '1.25', '1.5'];
const DEFAULT_ZOOM_LEVEL = ZOOM_LEVELS[2];

class MaskCell {
  template = template(`<div class="cell"></div>`)

  private $root!: HTMLElement;

  constructor(
    private x: number,
    private y: number,
    private type = MaskCellType.AlwaysEmpty,
    private disabled: boolean = false,
  ) { }

  replaceCellType(type: MaskCellType) {
    if (this.disabled) return;

    const oldType = this.type;
    this.type = type;
    this.$root.classList.replace(`cell-${oldType}`, `cell-${type}`);
  }

  render() {
    const inst = this.template.create();

    inst.setAttribute('data-col', this.x.toString());
    inst.setAttribute('data-row', this.y.toString());
    if (!this.disabled) {
      inst.classList.add(`cell-${this.type}`);
    } else {
      inst.classList.add(`cell-disabled`);
    }

    this.$root?.replaceWith(inst);
    this.$root = inst;

    return inst;
  }

  getType() {
    return this.type;
  }
}

export class Mask {
  template = template(`
    <div class="mask-container">
      <div class="mask"></div>
      <div class="controls">
        <button id="zoom-in" class="nes-btn">+</button>
        <button id="zoom-out" class="nes-btn">-</button>
        <button id="download" class="nes-btn download"> </button>
      </div>
    </div>
  `)

  private $root!: HTMLElement;
  private $mask!: HTMLElement;
  private $zoomOut!: HTMLButtonElement;
  private $zoomIn!: HTMLButtonElement;

  private cellsRefs: MaskCell[][] = [];
  private isDrawing: boolean = false;

  constructor(
    private state: State<InitialState>,
    private getSprite: () => HTMLCanvasElement | undefined
  ) {
    state.onPropertyChange('rows', this.onRowChange);
    state.onPropertyChange('cols', this.onColumnChange);
    state.onPropertyChange('mask', () => this.render());
    state.onPropertyChange('mirrorX', () => this.render());
  }

  render() {
    const container = this.template.create();
    const mask = container.querySelector('.mask') as HTMLElement;
    const zoomIn = container.querySelector('#zoom-in') as HTMLButtonElement;
    const zoomOut = container.querySelector('#zoom-out') as HTMLButtonElement;
    const download = container.querySelector('#download') as HTMLButtonElement;

    const cols = this.state.get('cols');
    const rows = this.state.get('rows');

    mask.style.setProperty('--rows', rows.toString());
    mask.style.setProperty('--cols', cols.toString());

    this.cellsRefs = make(rows, cols, new MaskCell(0, 0, 0, false));

    forEachCell(this.state.get('mask'), (cell, row, col) => {
      const disabled = this.state.get('mirrorX') && col >= Math.ceil(cols / 2)
      const maskCell = new MaskCell(col, row, cell, disabled);
      this.cellsRefs[row][col] = maskCell;
      mask.appendChild(maskCell.render());
    })

    mask.addEventListener('click', this.updateCurrentCell);
    mask.addEventListener('pointerdown', this.startDrawing);
    container.addEventListener('pointerleave', this.endDrawing);
    container.addEventListener('pointerup', this.endDrawing);
    container.addEventListener('pointermove', (e) => {
      if (!this.isDrawing) return;
      this.updateCurrentCell(e);
    })

    zoomIn.addEventListener('click', this.makeZoomFn(1))
    zoomOut.addEventListener('click', this.makeZoomFn(-1))
    download.addEventListener('click', this.dowload)

    this.$root?.replaceWith(container);
    this.$root = container;
    this.$mask = mask;
    this.$zoomIn = zoomIn;
    this.$zoomOut = zoomOut;

    return container;
  }

  private updateCurrentCell = (e: Event) => {
    const el = e.target as HTMLElement;
    let col = toNumber(el.getAttribute('data-col') ?? '');
    let row = toNumber(el.getAttribute('data-row') ?? '');
    if (Number.isNaN(col) || Number.isNaN(row)) return;

    const cell = this.cellsRefs[row][col];
    const cellType = this.state.get('tool');
    const mask = this.state.get('mask');

    cell.replaceCellType(cellType);
    mask[row][col] = cellType;

    this.state.set('mask', mask)
  }

  private endDrawing = () => {
    this.isDrawing = false;
  }

  private startDrawing = () => {
    this.isDrawing = true;
  }

  private onColumnChange = (oldValue: number, newValue: number) => {
    const mask = this.state.get('mask');
    const diff = newValue - oldValue;

    if (diff >= 0) {
      const delta = new Array(diff).fill(MaskCellType.AlwaysEmpty)
      this.state.set('mask', mask.map(row => [...row, ...delta]))
    } else {
      this.state.set('mask', mask.map(row => row.slice(0, diff)))
    }
  }

  private onRowChange = (oldValue: number, newValue: number) => {
    const mask = this.state.get('mask');
    const diff = newValue - oldValue;

    if (diff >= 0) {
      const cols = this.state.get('cols');
      for (let i = 0; i < diff; i++) {
        const emptyRow = new Array(cols).fill(MaskCellType.AlwaysEmpty);
        mask.push(emptyRow)
      }
      this.state.set('mask', mask)
    } else {
      this.state.set('mask', mask.slice(0, diff))
    }
  }

  private setButtonEnabled($el: HTMLButtonElement, value = true) {
    if (value) {
      $el.classList.remove('is-disabled')
      $el.removeAttribute('disabled')
    } else {
      $el.setAttribute('disabled', 'disabled')
      $el.classList.add('is-disabled')
    }
  }

  private makeZoomFn(deltaIndex: number) {
    return () => {
      const idx = this.getCurrentZoomLevel();
      const newValue = ZOOM_LEVELS.at(idx + deltaIndex);

      if (!newValue) return;

      this.$mask.style.setProperty('--zoom', newValue);
      this.setButtonEnabled(this.$zoomIn, newValue !== ZOOM_LEVELS.at(-1));
      this.setButtonEnabled(this.$zoomOut, newValue !== ZOOM_LEVELS.at(0));
    }
  }

  private getCurrentZoomLevel(): number {
    const currentZoom = this.$mask.style.getPropertyValue('--zoom') || DEFAULT_ZOOM_LEVEL;
    return ZOOM_LEVELS.findIndex(i => i === currentZoom);
  }

  private dowload = () => {
    const object = JSON.stringify({
      $schema: { version: "1.0.0" },
      meta: {
        name: "PickCells Mask",
        description: "Exported from PickCells",
        preview: this.getSprite()?.toDataURL() ?? ""
      },
      mask: this.state.get('mask'),
      cols: this.state.get('cols'),
      rows: this.state.get('rows'),
      outline: this.state.get('drawBorders')
    }, null, 2);

    const blob = new Blob([object], { type: 'application/json' });
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a');
    a.href = url;
    a.download = "pickcells.json";
    a.click();

    URL.revokeObjectURL(url);
  }
}