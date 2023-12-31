import { make } from "../lib/grid";
import { Mask, MaskCell } from "../lib/mask";

export class State<T extends object> {
  private proxy: T;
  private propsToListeners: Record<keyof T, Function[]> = {} as Record<keyof T, Function[]>;

  onPropertyChange<S extends keyof T>(property: S, callback: (oldValue: T[S], newValue: T[S]) => void) {
    this.propsToListeners[property].push(callback);
  }

  get<S extends keyof T>(property: S): T[S] {
    return structuredClone(this.proxy[property]);
  }

  set<S extends keyof T>(property: S, newValue: T[S]) {
    this.proxy[property] = structuredClone(newValue);
  }

  constructor(init: T) {
    for (const property of Object.keys(init)) {
      //@ts-expect-error
      this.propsToListeners[property] = [];
    }

    this.proxy = new Proxy(init, {
      set: (state, property, newValue) => {
        const oldValue = state[property as keyof T];
        state[property as keyof T] = newValue;
        this.flush(property as keyof T, oldValue, newValue);
        return true;
      },
    });

    if (window) {
      (window as any).state = this;
    }
  }

  private flush<S extends keyof T>(property: S, oldValue: T[S], newValue: T[S]) {
    for (const callback of this.propsToListeners[property]) {
      callback(oldValue, newValue);
    }
  }
}

export interface InitialState {
  cols: number;
  rows: number;
  mask: Mask;
  color: string;
  tool: MaskCell,
  results: number,
  outline: boolean,
  mirrorX: boolean,
}

export const initialState: InitialState = {
  cols: 8,
  rows: 8,
  mask: make(8, 8, MaskCell.Empty),
  color: '#e76e55',
  tool: MaskCell.Border,
  results: 8,
  outline: true,
  mirrorX: true,
}