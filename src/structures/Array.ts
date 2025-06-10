import { VariableData } from '../types';

export const arrayVariants = ['static', 'dynamic', 'multi-dimensional'] as const;
export type ArrayVariant = typeof arrayVariants[number];

export function createArraySandbox(variant: ArrayVariant) {
  const sandbox = {
    array: {
      data: variant === 'multi-dimensional' ? [] as any[][] : [] as any[],
      push(value: any) {
        if (variant === 'static' && this.data.length >= 10) return;
        this.data.push(value);
        return [...this.data];
      },
      pop() {
        const value = this.data.pop();
        return [...this.data];
      },
      set(row: number, col: number, value: any) {
        if (variant === 'multi-dimensional') {
          if (!this.data[row]) this.data[row] = [];
          (this.data as any[][])[row][col] = value;
          return [...this.data];
        }
        return this.data;
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { array: { data: any[] | any[][] } }): VariableData => ({
      array: sandbox.array.data,
    }),
  };
}