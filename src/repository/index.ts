export interface Repository {
  save(key: string, value: unknown): Promise<void>;
  load(key: string): Promise<unknown>;
}
