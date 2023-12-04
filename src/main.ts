import { Mask } from './ui/mask';
import { render } from './ui/utils';
import { Sidebar } from './ui/sidebar';
import { InitialState, State, initialState } from './ui/state';
import { fromMask } from './lib/sprite';
import { draw } from './ui/canvas';

const canavs = document.querySelector('canvas') as HTMLCanvasElement;
const state = new State<InitialState>(initialState);
const mask = new Mask(state);
const sidebar = new Sidebar(state, () => {
  const mask = state.get('mask');
  console.log(mask)
  const sprite = fromMask(mask);
  console.log(sprite)
  draw(sprite, canavs);
});

render(mask.render(), document.getElementById('mask')!);
render(sidebar.render(), document.querySelector('aside')!);