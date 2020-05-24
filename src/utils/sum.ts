export function sum(x: number[]): number {
  return x.reduce((prev, cur) => prev + cur, 0);
}
