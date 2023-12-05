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
          <input type="number" id="cols" class="nes-input" value="10">
        </div>

        <div class="nes-field">
          <label for="rows">Rows</label>
          <input type="number" id="rows" class="nes-input" value="10">
        </div>
      </section>

      <footer>
        <button class="nes-btn is-success" type="submit">Generate</button>
      </footer>
    </form>`)

  private instance!: HTMLElement;

  constructor(
    private state: State<typeof initialState>,
    private submit: () => void,
  ) { }

  render() {
    const inst = this.template.create()!;

    inst.querySelector('#cols')?.addEventListener('change', this.onUpdate('cols'));
    inst.querySelector('#rows')?.addEventListener('change', this.onUpdate('rows'));
    inst.addEventListener('submit', this.onSubmit);

    this.instance?.replaceWith(inst);
    this.instance = inst.firstChild as HTMLElement;

    return inst;
  }

  onUpdate = (property: keyof typeof initialState) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    const n = Number.parseInt(element.value, 10);
    this.state.set(property, n);
  }

  onSubmit = (e: Event) => {
    e.preventDefault();
    this.submit();
  }
}