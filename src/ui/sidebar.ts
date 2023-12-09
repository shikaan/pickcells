import { MaskCell, MaskCellValues, makeMask } from '../lib/mask';
import './sidebar.css';
import { State, initialState } from "./state";
import { template } from "./utils";

const maskCellValueToClassName = {
  [MaskCell.AlwaysBorder]: 'border',
  [MaskCell.AlwaysFilled]: 'filled',
  [MaskCell.BorderOrFilled]: 'filled-border',
  [MaskCell.EmptyOrFilled]: 'filled-empty',
  [MaskCell.AlwaysEmpty]: 'empty',
}

export class Sidebar {
  template = template(`
    <form>
      <header>
        <h1>Pixel Art Generator</h1>
      </header>

      <section>
        <div class="field-group--2">
          <div class="nes-field">
            <label for="cols">Cols</label>
            <input type="number" id="cols" class="nes-input" min="4" max="32" value="${initialState.cols}">
          </div>

          <div class="nes-field">
            <label for="rows">Rows</label>
            <input type="number" id="rows" class="nes-input" min="4" max="32" value="${initialState.rows}">
          </div>
        </div>

        <div class="nes-field">
          <label for="color">Color</label>
          <input type="color" id="color" class="nes-progress" value="${initialState.color}">
        </div>
        
        <div class="nes-field">
          <label>Brush</label>
          <div class="brush-container">
            ${MaskCellValues.map((value, i) => `
              <input type="radio" class="${maskCellValueToClassName[value]}" id="brush-${value}" name="brush" value="${value}" ${i == 0 ? 'checked' : ''} />
        `).join('\n')}
          </div>
        </div>

        <div class="nes-field">
          <label for="count">Previews</label>
          <input type="number" id="count" class="nes-input" min="1" max="100" value="${initialState.previewCount}">
        </div>
      </section>

      <footer>
        <button class="nes-btn is-primary" type="submit">Generate</button>
      </footer>
    </form>`)

  private instance!: HTMLElement;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void
  ) {
    document.documentElement.style.setProperty("--color-filled", initialState.color);
    state.onPropertyChange('color', (_, newValue) => {
      document.documentElement.style.setProperty("--color-filled", newValue);
    });
  }

  render() {
    const inst = this.template.create()!;

    inst.querySelector('#cols')?.addEventListener('change', this.onUpdateSize('cols'));
    inst.querySelector('#rows')?.addEventListener('change', this.onUpdateSize('rows'));
    inst.querySelector('#color')?.addEventListener('change', this.onUpdateColor);
    inst.querySelector('#count')?.addEventListener('change', this.onUpdateCount);
    inst.querySelectorAll('input[name="brush"]')?.forEach(e => {
      e.addEventListener('change', this.onUpdateBrush);
    })
    inst.addEventListener('submit', this.onSubmit);

    this.instance?.replaceWith(inst);
    this.instance = inst.firstChild as HTMLElement;

    return inst;
  }

  onUpdateBrush = (e: Event) => {
    const element = e.target as HTMLInputElement;
    const brush = element.value;
    this.state.set('brush', makeMask(brush));
  }

  onUpdateColor = (e: Event) => {
    const element = e.target as HTMLInputElement;
    const color = element.value;
    this.state.set('color', color);
  }

  onUpdateCount = (e: Event) => {
    const element = e.target as HTMLInputElement;
    const count = element.value;
    this.state.set('previewCount', Number.parseInt(count, 10));
  }

  onUpdateSize = (property: keyof typeof initialState) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    const n = Number.parseInt(element.value, 10);
    this.state.set(property, n);
  }

  onSubmit = (e: Event) => {
    e.preventDefault();
    this.submit();
  }
}