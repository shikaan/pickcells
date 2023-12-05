import { Mask } from './ui/mask';
import { render } from './ui/utils';
import { Sidebar } from './ui/sidebar';
import { InitialState, State, initialState } from './ui/state';
import { fromMask } from './lib/sprite';
import { Preview } from './ui/preview';

const state = new State<InitialState>(initialState);
const preview = new Preview(state);
const mask = new Mask(state);
const sidebar = new Sidebar(state, () => {
  const mask = state.get('mask');
  const sprite = fromMask(mask);
  state.set('sprite', sprite);
  preview.update();
}, () => preview.update());

render(mask.render(), document.querySelector('#mask')!);
render(sidebar.render(), document.querySelector('aside')!);
render(preview.render(), document.querySelector('#preview')!);