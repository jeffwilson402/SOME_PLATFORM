import { randNumber } from "@ngneat/falso";

export async function fillArray<T>(amount: number, callback: () => Promise<T>) {
  const arr: T[] = [];
  for (let i = 0; i < amount; i++) arr.push(await callback());
  return arr;
}

export function getRandomElements<T>(
  array: T[],
  min: number = 1,
  max: number = 4
): T[] {
  const amount = randNumber({ min, max });
  const rtn: T[] = [];
  for (let i = 0; i < amount; i++) {
    rtn.push(array[randNumber({ min: 0, max: array.length - 1 })]);
  }
  return rtn;
}
