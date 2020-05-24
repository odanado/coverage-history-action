import { sum } from "./sum";

export function average(x: number[]): number {
  return sum(x) / x.length;
}
