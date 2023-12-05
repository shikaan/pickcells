import './mask.css'
import { MaskCell as MaskCellType, Mask as MaskType } from "../lib/mask";
import { template } from "./utils";
import { InitialState, State } from './state';

class MaskCell {
  template = template(`<div class="cell"></div>`)

  private instance!: HTMLElement;
  private type = MaskCellType.AlwaysEmpty;

  constructor(
    private x: number,
    private y: number,
    private disabled: boolean = false,
  ) { }

  replaceCellType(type: MaskCellType) {
    if (this.disabled) return;

    const oldType = this.type;
    this.type = type;
    this.instance.classList.replace(`cell-${oldType}`, `cell-${type}`);
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

    this.instance?.replaceWith(inst);
    this.instance = inst;

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
    </div>
  `)

  private instance!: HTMLElement;
  private cellsRefs: MaskCell[][] = [];
  private isDrawing: boolean = false;

  constructor(
    private state: State<InitialState>,
  ) {
    this.render();

    state.onPropertyChange('rows', () => this.render());
    state.onPropertyChange('cols', () => this.render());
  }

  render() {
    const container = this.template.create();
    const mask = container.querySelector('.mask') as HTMLElement;
    const cols = this.state.get('cols');
    const rows = this.state.get('rows');

    mask.style.setProperty('--rows', rows.toString());
    mask.style.setProperty('--cols', cols.toString());

    this.cellsRefs = []
    for (let row = 0; row < rows; row++) {
      this.cellsRefs[row] = [];
      for (let col = 0; col < cols; col++) {
        const cell = new MaskCell(col, row, col >= Math.ceil(cols / 2));
        this.cellsRefs[row][col] = cell;
        mask.appendChild(cell.render());
      }
    }

    mask.addEventListener('click', (e) => {
      this.updateCurrentCell(e);
      this.updateMask();
    })
    mask.addEventListener('pointerdown', this.startDrawing);
    container.addEventListener('pointerleave', this.endDrawing);
    container.addEventListener('pointerup', this.endDrawing);
    container.addEventListener('pointermove', (e) => {
      if (!this.isDrawing) return;
      this.updateCurrentCell(e);
    })

    this.instance?.replaceWith(container);
    this.instance = container;
    this.updateMask();

    return container;
  }

  private updateMask() {
    const cols = this.state.get('cols');
    const rows = this.state.get('rows');
    const mask: MaskType = [];

    for (let row = 0; row < rows; row++) {
      mask[row] = [];
      for (let col = 0; col < cols; col++) {
        mask[row][col] = this.cellsRefs[row][col].getType();
      }
    }

    this.state.set('mask', mask);
  }

  updateCurrentCell = (e: Event) => {
    const el = e.target as HTMLElement;
    const col = el.getAttribute('data-col');
    const row = el.getAttribute('data-row');
    if (!col || !row) return;

    // @ts-expect-error
    const cell = this.cellsRefs[row][col];

    cell.replaceCellType(this.state.get('brush'));
  }

  endDrawing = () => {
    this.isDrawing = false;
    this.updateMask();
  }

  startDrawing = () => {
    this.isDrawing = true;
  }
}