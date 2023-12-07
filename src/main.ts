import { Mask } from './ui/mask';
import { render } from './ui/utils';
import { Sidebar } from './ui/sidebar';
import { InitialState, State, initialState } from './ui/state';
import { Preview } from './ui/preview';

const state = new State<InitialState>(initialState);
const preview = new Preview(state);
const mask = new Mask(state);
const sidebar = new Sidebar(state, () => preview.render());

render(mask.render(), document.querySelector('#mask')!);
render(sidebar.render(), document.querySelector('#sidebar')!);
render(preview.render(), document.querySelector('#preview')!);