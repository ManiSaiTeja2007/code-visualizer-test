import { VariableData } from '../types';

interface StackNode {
  value: any;
  next: StackNode | null;
}

export const stackVariants = ['array-based', 'linkedlist-based'] as const;
export type StackVariant = typeof stackVariants[number];

export function createStackSandbox(variant: StackVariant) {
  const isArrayBased = variant === 'array-based';
  const sandbox = {
    stack: {
      data: isArrayBased ? [] as any[] : { head: null } as { head: StackNode | null },
      push(value: any) {
        if (variant === 'array-based') {
          (this.data as any[]).push(value);
          return [...(this.data as any[])];
        } else {
          const data = this.data as { head: StackNode | null };
          data.head = { value, next: data.head };
          return data;
        }
      },
      pop() {
        if (variant === 'array-based') {
          const value = (this.data as any[]).pop();
          return [...(this.data as any[])];
        } else {
          const data = this.data as { head: StackNode | null };
          if (!data.head) return null;
          const value = data.head.value;
          data.head = data.head.next;
          return data;
        }
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { stack: { data: any[] | { head: StackNode | null } } }): VariableData => ({
      stack: sandbox.stack.data,
    }),
  };
}