import "./dialogs.css";
import { template } from "../utils";

export class Dialog {
  private static isInitialised = false;

  template = template(`<div></div>`);
  dialog = template(`<dialog class="nes-dialog dialog"></dialog>`);

  private $contents: Record<string, HTMLDialogElement> = {};
  private $current: string | null = null;
  private $root!: HTMLElement;

  constructor() {
    if (Dialog.isInitialised) {
      throw new Error('Cannot initialise more than one instance of Dialog');
    }

    Dialog.isInitialised = true;
    this.render();
    window.addEventListener('load', this.onHashChange, true);
    window.addEventListener('hashchange', this.onHashChange);
  }

  render() {
    if (this.$root) return this.$root;

    this.$root = this.template.create() as HTMLDialogElement;
    return this.$root;
  }

  register(id: string, $content: HTMLElement) {
    if (this.$contents[id]) {
      console.warn(`Dialog with id ${id} already exists`);
      return
    }
    const dialog = this.dialog.create() as HTMLDialogElement;

    dialog.id = `dialog-${id}`
    dialog.appendChild($content);
    dialog.addEventListener('close', () => this.close(id));
    dialog.addEventListener('cancel', () => this.close(id));
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        this.close();
      }
    })
    dialog.querySelector('header .close')?.addEventListener('click', () => this.close(id));

    this.$root.appendChild(dialog);
    this.$contents[id] = dialog;
  }

  open = (id: string) => {
    if (!this.$contents[id] || this.$current === id) return;

    if (this.$current) {
      const current = this.$contents[this.$current];
      current?.close();
    }

    this.$current = id;
    this.$contents[this.$current].showModal();
  }

  close = (id = this.$current) => {
    if (!id) return;
    this.$contents[id].close();
    this.$current = null;
    window.location.hash = window.location.hash.replace(`${id}`, '');
  }

  private onHashChange = () => {
    const id = window.location.hash.slice(1);
    if (!this.$contents[id] || this.$current === id) return;

    this.open(id);
  }
}