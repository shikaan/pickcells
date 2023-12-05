import { MaskCell, makeMask } from '../lib/mask';
import './sidebar.css';
import { State, initialState } from "./state";
import { template } from "./utils";

export class Sidebar {
  template = template(`
    <form>
      <header>
        <h1>Pixel Art Generator</h1>
      </header>

      <section>
        <div class="nes-field">
          <label for="cols">Columns</label>
          <input type="number" id="cols" class="nes-input" value="${initialState.cols}">
        </div>

        <div class="nes-field">
          <label for="rows">Rows</label>
          <input type="number" id="rows" class="nes-input" value="${initialState.rows}">
        </div>

        <div class="nes-field">
          <label for="color">Color</label>
          <input type="color" id="color" class="nes-progress" value="${initialState.color}">
          </div>
          
          <div class="nes-field">
            <label>Brush</label>
            <label>
              <input type="radio" class="nes-radio" name="brush" value="${MaskCell.AlwaysBorder}" checked />
              <span>
                <i class="brush-preview border"></i>  
                Border
              </span>
            </label>
            <label>
              <input type="radio" class="nes-radio" name="brush" value="${MaskCell.AlwaysFilled}" />
              <span>
                <i class="brush-preview filled"></i>
                Filled
              </span>
            </label>
            <label>
              <input type="radio" class="nes-radio" name="brush" value="${MaskCell.BorderOrFilled}" />
              <span>
                <i class="brush-preview filled-border"></i>
                Filled-Border
              </span>
            </label>
            <label>
              <input type="radio" class="nes-radio" name="brush" value="${MaskCell.EmptyOrFilled}" />
              <span>
                <i class="brush-preview filled-empty"></i>
                Filled-Empty
              </span>
            </label>
            <label>
              <input type="radio" class="nes-radio" name="brush" value="${MaskCell.AlwaysEmpty}" />
              <span>
                <i class="brush-preview empty"></i>
                Eraser
              </span>
            </label>
        </div>
      </section>

      <footer>
        <button class="nes-btn is-primary" type="submit">Generate</button>
      </footer>
    </form>`)

  private instance!: HTMLElement;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void,
    private updatePreview: () => void,
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
    this.updatePreview()
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