import { VariableData } from '../types';

interface QueueNode {
  value: any;
  next: QueueNode | null;
}

export const queueVariants = ['array-based', 'circular', 'priority', 'deque'] as const;
export type QueueVariant = typeof queueVariants[number];

export function createQueueSandbox(variant: QueueVariant) {
  const isArrayBased = variant === 'array-based' || variant === 'circular' || variant === 'priority' || variant === 'deque';
  const sandbox = {
    queue: {
      data: isArrayBased ? [] as any[] : { head: null, tail: null } as { head: QueueNode | null; tail: QueueNode | null },
      enqueue(value: any, priority?: number) {
        if (variant === 'priority') {
          (this.data as any[]).push({ value, priority: priority || 0 });
          (this.data as any[]).sort((a: any, b: any) => b.priority - a.priority);
          return [...(this.data as any[])];
        } else if (variant === 'array-based' || variant === 'circular') {
          if (variant === 'circular' && (this.data as any[]).length >= 10) {
            (this.data as any[]).shift();
          }
          (this.data as any[]).push(value);
          return [...(this.data as any[])];
        } else if (variant === 'deque') {
          (this.data as any[]).push(value);
          return [...(this.data as any[])];
        } else {
          const newNode: QueueNode = { value, next: null };
          const data = this.data as { head: QueueNode | null; tail: QueueNode | null };
          if (!data.head) {
            data.head = newNode;
            data.tail = newNode;
          } else {
            data.tail!.next = newNode;
            data.tail = newNode;
          }
          return data;
        }
      },
      dequeue() {
        if (variant === 'array-based' || variant === 'circular' || variant === 'priority') {
          const value = (this.data as any[]).shift();
          return [...(this.data as any[])];
        } else if (variant === 'deque') {
          const value = (this.data as any[]).shift();
          return [...(this.data as any[])];
        } else {
          const data = this.data as { head: QueueNode | null; tail: QueueNode | null };
          if (!data.head) return null;
          const value = data.head.value;
          data.head = data.head.next;
          if (!data.head) data.tail = null;
          return data;
        }
      },
      pushFront(value: any) {
        if (variant === 'deque') {
          (this.data as any[]).unshift(value);
          return [...(this.data as any[])];
        }
        return this.data;
      },
      popFront() {
        if (variant === 'deque') {
          const value = (this.data as any[]).shift();
          return [...(this.data as any[])];
        }
        return this.data;
      },
      pushBack(value: any) {
        if (variant === 'deque') {
          (this.data as any[]).push(value);
          return [...(this.data as any[])];
        }
        return this.data;
      },
      popBack() {
        if (variant === 'deque') {
          const value = (this.data as any[]).pop();
          return [...(this.data as any[])];
        }
        return this.data;
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { queue: { data: any[] | { head: QueueNode | null; tail: QueueNode | null } } }): VariableData => ({
      queue: sandbox.queue.data,
    }),
  };
}
