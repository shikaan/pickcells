import { Mask } from './ui/mask';
import { render } from './ui/utils';
import { Sidebar } from './ui/sidebar';
import { InitialState, State, initialState } from './ui/state';
import { Preview } from './ui/preview';
import { Dialog } from './ui/dialogs/dialogs';

const state = new State<InitialState>(initialState);
const dialog = new Dialog();
const preview = new Preview(state);
const mask = new Mask(state, () => preview.getSprite());
const sidebar = new Sidebar(state, () => preview.render(), dialog);

render(dialog.render(), document.querySelector('#dialogs')!);
render(mask.render(), document.querySelector('#mask')!);
render(sidebar.render(), document.querySelector('#sidebar')!);
render(preview.render(), document.querySelector('#preview')!);