export function template(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return {
    create() {
      // @ts-expect-error
      return template.content.cloneNode(true).firstElementChild as HTMLElement;
    }
  };
}

export function render<T extends HTMLElement>(element: T, parent: HTMLElement) {
  parent.replaceWith(element);
  return element;
}

export const identity = (x: string) => x
export const toNumber = (x: string) => Number.parseInt(x, 10)