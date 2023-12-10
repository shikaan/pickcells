import { MaskCell, MaskCellValues, makeMask } from '../lib/mask';
import { AboutDialog } from './dialogs/about';
import { Dialog } from './dialogs/dialogs';
import { HelpDialog } from './dialogs/help';
import './sidebar.css';
import { InitialState, State, initialState } from "./state";
import { identity, template, toNumber } from "./utils";
import { ExamplesDialog } from './dialogs/examples';

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
          <a href="#examples" class="nes-text">Examples</a>&nbsp;|&nbsp;
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
  $cols: any;
  $rows: any;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void,
    dialog: Dialog
  ) {
    document.documentElement.style.setProperty("--color-filled", initialState.color);

    state.onPropertyChange('color', (_, newValue) => {
      document.documentElement.style.setProperty("--color-filled", newValue);
    });
    state.onPropertyChange('cols', (_, value) => {
      this.$cols?.setAttribute('value', value.toString())
    })
    state.onPropertyChange('rows', (_, value) => {
      this.$rows?.setAttribute('value', value.toString())
    })

    dialog.register('info', new HelpDialog().render());
    dialog.register('about', new AboutDialog().render());
    dialog.register('examples', new ExamplesDialog(state, () => dialog.close()).render());
  }

  render() {
    const inst = this.template.create()!;

    this.$cols = inst.querySelector('#cols');
    this.$rows = inst.querySelector('#rows');

    this.$cols?.addEventListener('change', this.setStateFromTargetValue('cols', toNumber));
    this.$rows?.addEventListener('change', this.setStateFromTargetValue('rows', toNumber));
    inst.querySelector('#color')?.addEventListener('change', this.setStateFromTargetValue('color', identity));
    inst.querySelector('#count')?.addEventListener('change', this.setStateFromTargetValue('previewCount', toNumber));
    inst.querySelector('#outline')?.addEventListener('change', this.setStateFromTargetChecked('drawBorders'));

    inst.querySelectorAll('input[name="tool"]')?.forEach(e => {
      e.addEventListener('change', this.setStateFromTargetValue('tool', makeMask));
    })
    inst.addEventListener('submit', this.onSubmit);

    this.$root?.replaceWith(inst);
    this.$root = inst;

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