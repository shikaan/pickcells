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
    private draw: () => void,
  ) { }

  render() {
    const inst = this.template.create()!;

    inst.querySelector('#cols')?.addEventListener('change', this.update('cols'));
    inst.querySelector('#rows')?.addEventListener('change', this.update('rows'));
    inst.addEventListener('submit', this.submit);

    this.instance?.replaceWith(inst);
    this.instance = inst.firstChild as HTMLElement;

    return inst;
  }

  update = (property: keyof typeof initialState) => (e: Event) => {
    const element = e.target as HTMLInputElement;
    const n = Number.parseInt(element.value, 10);
    this.state.set(property, n);
  }

  submit = (e: Event) => {
    e.preventDefault();
    this.draw();
  }
}