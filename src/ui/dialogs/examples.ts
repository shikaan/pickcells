import './examples.css'
import { template } from "../utils";
import { InitialState, State } from '../state';

import pokemon from '../../examples/pokemon.json';
import spaceship from '../../examples/spaceship.json';
import sword from '../../examples/sword.json';
import potion from '../../examples/potion.json';
import mushroom from '../../examples/mushroom.json';

export class ExamplesDialog {
  template = template(`
    <span>
      <header>
        <h2>Examples</h2>
        <button class="nes-btn is-error close">X</button>
      </header>
      <section></section>
    </span>
  `)

  constructor(private state: State<InitialState>, private close: () => void) { }

  makeExample = (example: any) => {
    const result = template(`
      <div class="nes-container with-title is-centered example">
        <p class="title">${example.meta.name}</p>
        <img src="${example.meta.preview}" alt="Preview of ${example.meta.name}" />
        <p class="description">${example.meta.description}</p>
        <button class="nes-btn is-primary">
          Open
        </button>
      </div>
    `).create();

    result.querySelector('button')?.addEventListener('click', () => {
      if (window.confirm('Are you sure you want to load this example and lose current progress?\nThis action cannot be undone.')) {
        this.state.set('cols', example.cols);
        this.state.set('rows', example.rows);
        this.state.set('outline', example.outline);
        this.state.set('mirrorX', example.mirrorX);
        this.state.set('mask', structuredClone(example.mask));
        this.close();
      }
    })

    return result;
  }

  render() {
    const root = this.template.create() as HTMLElement;
    const section = root.querySelector('section') as HTMLElement;

    section.append(this.makeExample(pokemon))
    section.append(this.makeExample(spaceship))
    section.append(this.makeExample(sword))
    section.append(this.makeExample(potion))
    section.append(this.makeExample(mushroom))

    return root
  }
}