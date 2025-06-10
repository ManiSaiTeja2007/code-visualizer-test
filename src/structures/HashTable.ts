import { VariableData } from '../types';

export const hashTableVariants = ['separate-chaining', 'linear-probing'] as const;
export type HashTableVariant = typeof hashTableVariants[number];

export function createHashTableSandbox(variant: HashTableVariant) {
  const sandbox = {
    hash: {
      data: variant === 'separate-chaining' ? [] as any[][] : {} as { [key: number]: { key: any; value: any } },
      put(key: any, value: any) {
        if (variant === 'separate-chaining') {
          const index = key % 10;
          if (!this.data[index]) this.data[index] = [];
          (this.data as any[][])[index].push({ key, value });
          return this.data;
        } else {
          let index = key % 10;
          let i = 1;
          while ((this.data as { [key: number]: any })[index] && (this.data as { [key: number]: any })[index].key !== key) {
            index = (index + i) % 10;
            i++;
          }
          (this.data as { [key: number]: any })[index] = { key, value };
          return this.data;
        }
      },
      get(key: any) {
        if (variant === 'separate-chaining') {
          const index = key % 10;
          const bucket = (this.data as any[][])[index] || [];
          const pair = bucket.find((p: any) => p.key === key);
          return pair ? pair.value : null;
        } else {
          let index = key % 10;
          let i = 1;
          while ((this.data as { [key: number]: any })[index] && (this.data as { [key: number]: any })[index].key !== key) {
            index = (index + i) % 10;
            i++;
          }
          return (this.data as { [key: number]: any })[index] ? (this.data as { [key: number]: any })[index].value : null;
        }
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { hash: { data: any[][] | { [key: number]: any } } }): VariableData => ({
      hash: sandbox.hash.data,
    }),
  };
}