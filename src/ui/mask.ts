import './mask.css'
import { MaskCell as MaskCellType, Mask as MaskType } from "../lib/mask";
import { template } from "./utils";
import { InitialState, State, initialState } from './state';

class MaskCell {
  template = template(`<div class="cell"></div>`)

  private instance!: HTMLElement;
  private type = MaskCellType.AlwaysEmpty;

  constructor(
    private x: number,
    private y: number,
    private updateMask: () => void,
    private state: State<InitialState>,
  ) { }

  private onClick() {
    const oldType = this.type;
    this.type = this.state.get('brush');
    this.instance.classList.replace(`cell-${oldType}`, `cell-${this.type}`);
    this.updateMask();
  }

  render() {
    const inst = this.template.create();

    inst.setAttribute('data-col', this.x.toString());
    inst.setAttribute('data-row', this.y.toString());
    inst.classList.add(`cell-${this.type}`);
    inst.addEventListener('click', this.onClick.bind(this));

    this.instance?.replaceWith(inst);
    this.instance = inst;

    return inst;
  }

  getType() {
    return this.type;
  }
}

export class Mask {
  template = template(`<div class="mask"></div>`)

  private instance!: HTMLElement;
  private cellsRefs: MaskCell[][] = [];

  constructor(
    private state: State<typeof initialState>,
  ) {
    this.render();

    state.onPropertyChange('rows', () => this.render());
    state.onPropertyChange('cols', () => this.render());
  }

  render() {
    const inst = this.template.create();
    const cols = this.state.get('cols');
    const rows = this.state.get('rows');

    inst.style.setProperty('--rows', rows.toString());
    inst.style.setProperty('--cols', cols.toString());

    this.cellsRefs = []
    for (let x = 0; x < cols; x++) {
      this.cellsRefs[x] = [];
      for (let y = 0; y < rows; y++) {
        const cell = new MaskCell(x, y, this.updateMask.bind(this), this.state);
        this.cellsRefs[x][y] = cell;
        inst.appendChild(cell.render());
      }
    }

    this.instance?.replaceWith(inst);
    this.instance = inst;
    this.updateMask();

    return inst;
  }

  updateMask() {
    const cols = this.state.get('cols');
    const rows = this.state.get('rows');
    const mask: MaskType = [];

    for (let x = 0; x < cols; x++) {
      mask[x] = [];
      for (let y = 0; y < rows; y++) {
        mask[x][y] = this.cellsRefs[x][y].getType();
      }
    }

    this.state.set('mask', mask);
  }
}