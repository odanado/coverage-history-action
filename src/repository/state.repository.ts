import { saveState, getState } from "@actions/core";

import { Repository } from "./index";

export class StateRepository implements Repository {
  async save(key: string, value: unknown): Promise<void> {
    saveState(key, JSON.stringify(value));
  }

  async load(key: string): Promise<unknown> {
    const value = getState(key);
    return JSON.parse(value);
  }
}
