import { State, initialState } from "./state";
import { template } from "./utils";

export class Sidebar {
  template = template(`
    <form id=lol>
      <h1>Logo</h1>
      <label for="cols">
        Columns
        <input id="cols" type="number" value="10">
      </label>
      <label for="rows">
        Rows
        <input id="rows" type="number" value="10">
      </label>
      <button type="submit">Generate</button>
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