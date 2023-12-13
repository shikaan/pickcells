import { MaskCell, MaskCellValues, makeMask } from '../lib/mask';
import { AboutDialog } from './dialogs/about';
import { Dialog } from './dialogs/dialogs';
import { HelpDialog } from './dialogs/help';
import './sidebar.css';
import { InitialState, State, initialState } from "./state";
import { identity, template, toNumber } from "./utils";
import { ExamplesDialog } from './dialogs/examples';

const maskCellValueToClassName = {
  [MaskCell.Border]: 'border',
  [MaskCell.Filled]: 'filled',
  [MaskCell.BorderOrFilled]: 'filled-border',
  [MaskCell.EmptyOrFilled]: 'filled-empty',
  [MaskCell.Empty]: 'empty',
}

const maskCellValueToToolName = {
  [MaskCell.Border]: 'Pencil',
  [MaskCell.Filled]: 'Color',
  [MaskCell.BorderOrFilled]: 'Pencil-Color',
  [MaskCell.EmptyOrFilled]: 'Empty-Color',
  [MaskCell.Empty]: 'Eraser',
}

export class Sidebar {
  template = template(`
    <form>
      <header>
        <span class="logo-container">
          <img src="logo.png" alt="logo"/>
          <h1>PickCells</h1>
        </span>
        <menu class="links">
          <a href="#info" class="nes-text">Help</a>|
          <a href="#examples" class="nes-text">Examples</a>|
          <a href="https://github.com/shikaan/pickcells/issues/new" target="_blank" class="nes-text">Feedback</a>|
          <a href="#about" class="nes-text">?</a>
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
          <input type="number" id="count" class="nes-input" min="1" max="100" value="${initialState.results}">
        </div>

        <div class="nes-field">
          <label for="outline">
            <input type="checkbox" id="outline" class="nes-checkbox" ${initialState.outline ? 'checked' : ''}>
            <span>Outline</span>
          </label>
          <label for="mirrorX">
            <input type="checkbox" id="mirrorX" class="nes-checkbox" ${initialState.mirrorX ? 'checked' : ''}>
            <span>Mirror X</span>
          </label>
        </div>
      </section>

      <footer>
        <button class="nes-btn is-primary" type="submit">Generate</button>
      </footer>
    </form>`)

  private $root!: HTMLElement;
  private $cols!: HTMLElement;
  private $rows!: HTMLElement;
  private $outline!: HTMLInputElement;
  private $mirrorX!: HTMLInputElement;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void,
    dialog: Dialog
  ) {
    document.documentElement.style.setProperty("--color-filled", initialState.color);

    state.onPropertyChange('color', (_, value) => {
      document.documentElement.style.setProperty("--color-filled", value);
    });
    state.onPropertyChange('cols', (_, value) => {
      this.$cols?.setAttribute('value', value.toString())
    })
    state.onPropertyChange('rows', (_, value) => {
      this.$rows?.setAttribute('value', value.toString())
    })
    state.onPropertyChange('outline', (_, value) => {
      this.$outline.checked = value
    })
    state.onPropertyChange('mirrorX', (_, value) => {
      this.$mirrorX.checked = value
    })

    dialog.register('info', new HelpDialog().render());
    dialog.register('about', new AboutDialog().render());
    dialog.register('examples', new ExamplesDialog(state, () => dialog.close()).render());
  }

  render() {
    const inst = this.template.create()!;

    this.$cols = inst.querySelector('#cols') as HTMLElement;
    this.$rows = inst.querySelector('#rows') as HTMLElement;
    this.$outline = inst.querySelector('#outline') as HTMLInputElement;
    this.$mirrorX = inst.querySelector('#mirrorX') as HTMLInputElement;

    this.$cols?.addEventListener('change', this.setStateFromTargetValue('cols', toNumber));
    this.$rows?.addEventListener('change', this.setStateFromTargetValue('rows', toNumber));
    inst.querySelector('#color')?.addEventListener('change', this.setStateFromTargetValue('color', identity));
    inst.querySelector('#count')?.addEventListener('change', this.setStateFromTargetValue('results', toNumber));
    this.$outline.addEventListener('change', this.setStateFromTargetChecked('outline'));
    this.$mirrorX.addEventListener('change', this.setStateFromTargetChecked('mirrorX'));

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

  private setStateFromTargetChecked = <S extends 'outline' | 'mirrorX'>(property: S) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    this.state.set(property, element.checked);
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    this.submit();
  }
}