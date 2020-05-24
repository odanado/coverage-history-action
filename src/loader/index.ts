import { Coverage } from "../type";

export interface Loader {
  load(): Promise<Coverage>;
}
