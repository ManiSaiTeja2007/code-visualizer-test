import { VariableData } from '../types';

export const heapVariants = ['min-heap', 'max-heap', 'binomial'] as const;
export type HeapVariant = typeof heapVariants[number];

export function createHeapSandbox(variant: HeapVariant) {
  const sandbox = {
    heap: {
      data: [] as any[],
      pushToHeap(value: number) {
        if (variant === 'min-heap' || variant === 'max-heap') {
          this.data.push(value);
          let i = this.data.length - 1;
          while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            const compare = variant === 'max-heap' ? this.data[i] > this.data[parent] : this.data[i] < this.data[parent];
            if (!compare) break;
            [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
            i = parent;
          }
          return [...this.data];
        }
        return this.data;
      },
      popFromHeap() {
        if (variant === 'min-heap' || variant === 'max-heap') {
          if (this.data.length > 0) {
            const result = this.data[0];
            this.data[0] = this.data[this.data.length - 1];
            this.data.pop();
            if (this.data.length > 0) {
              let i = 0;
              while (true) {
                let largest = i;
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                if (left < this.data.length) {
                  const compareLeft = variant === 'max-heap' ? this.data[left] > this.data[largest] : this.data[left] < this.data[largest];
                  if (compareLeft) largest = left;
                }
                if (right < this.data.length) {
                  const compareRight = variant === 'max-heap' ? this.data[right] > this.data[largest] : this.data[right] < this.data[largest];
                  if (compareRight) largest = right;
                }
                if (largest === i) break;
                [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
                i = largest;
              }
            }
            return [...this.data];
          }
          return [...this.data];
        }
        return null;
      },
      insert(value: number) {
        if (variant === 'binomial') {
          this.data.push(value);
          return [...this.data];
        }
        return this.data;
      },
      extractMin() {
        if (variant === 'binomial' && this.data.length > 0) {
          const min = Math.min(...this.data);
          this.data = this.data.filter((v: number) => v !== min);
          return [...this.data];
        }
        return this.data;
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { heap: { data: any[] } }): VariableData => ({
      heap: sandbox.heap.data,
    }),
  };
}