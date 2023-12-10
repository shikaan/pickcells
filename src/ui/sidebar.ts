import { MaskCell, MaskCellValues, makeMask } from '../lib/mask';
import { AboutDialog } from './about';
import { Dialog } from './dialogs';
import { HelpDialog } from './help';
import './sidebar.css';
import { InitialState, State, initialState } from "./state";
import { identity, template, toNumber } from "./utils";

const maskCellValueToClassName = {
  [MaskCell.AlwaysBorder]: 'border',
  [MaskCell.AlwaysFilled]: 'filled',
  [MaskCell.BorderOrFilled]: 'filled-border',
  [MaskCell.EmptyOrFilled]: 'filled-empty',
  [MaskCell.AlwaysEmpty]: 'empty',
}

const maskCellValueToToolName = {
  [MaskCell.AlwaysBorder]: 'Pencil',
  [MaskCell.AlwaysFilled]: 'Color',
  [MaskCell.BorderOrFilled]: 'Pencil-Color',
  [MaskCell.EmptyOrFilled]: 'Empty-Color',
  [MaskCell.AlwaysEmpty]: 'Eraser',
}

export class Sidebar {
  template = template(`
    <form>
      <header>
        <span>
          <img src="logo.png"/>
          <h1>PickCells</h1>
        </span>
        <menu class="links">
          <a href="#info" class="nes-text">Help</a>&nbsp;|&nbsp;
          <a href="#samples" class="nes-text">Samples</a>&nbsp;|&nbsp;
          <a href="#about" class="nes-text">About</a>
        </menu>
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
          <label>Tools</label>
          <div class="tool-container">
            ${MaskCellValues.map((value, i) => `
              <input title="${maskCellValueToToolName[value]}" type="radio" class="${maskCellValueToClassName[value]}" id="tool-${value}" name="tool" value="${value}" ${i == 0 ? 'checked' : ''} />
        `).join('\n')}
          </div>
        </div>

        <div class="nes-field">
          <label for="count">Results</label>
          <input type="number" id="count" class="nes-input" min="1" max="100" value="${initialState.previewCount}">
        </div>

        <div class="nes-field">
          <label for="outline">
            <input type="checkbox" id="outline" class="nes-checkbox" ${initialState.drawBorders ? 'checked' : ''}>
            <span>Outline</span>
          </label>
        </div>
      </section>

      <footer>
        <button class="nes-btn is-primary" type="submit">Generate</button>
      </footer>
    </form>`)

  private $root!: HTMLElement;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void,
    dialog: Dialog
  ) {
    document.documentElement.style.setProperty("--color-filled", initialState.color);
    state.onPropertyChange('color', (_, newValue) => {
      document.documentElement.style.setProperty("--color-filled", newValue);
    });

    dialog.register('info', new HelpDialog().render());
    dialog.register('about', new AboutDialog().render());
  }

  render() {
    const inst = this.template.create()!;

    inst.querySelector('#cols')?.addEventListener('change', this.setStateFromTargetValue('cols', toNumber));
    inst.querySelector('#rows')?.addEventListener('change', this.setStateFromTargetValue('rows', toNumber));
    inst.querySelector('#color')?.addEventListener('change', this.setStateFromTargetValue('color', identity));
    inst.querySelector('#count')?.addEventListener('change', this.setStateFromTargetValue('previewCount', toNumber));
    inst.querySelector('#outline')?.addEventListener('change', this.setStateFromTargetChecked('drawBorders'));

    inst.querySelectorAll('input[name="tool"]')?.forEach(e => {
      e.addEventListener('change', this.setStateFromTargetValue('tool', makeMask));
    })
    inst.addEventListener('submit', this.onSubmit);

    this.$root?.replaceWith(inst);
    this.$root = inst.firstChild as HTMLElement;

    return inst;
  }

  private setStateFromTargetValue = <S extends keyof InitialState>(property: S, transform: (x: string) => InitialState[S]) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    this.state.set(property, transform(element.value));
  }

  private setStateFromTargetChecked = <S extends 'drawBorders'>(property: S) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    this.state.set(property, element.checked);
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    this.submit();
  }
}