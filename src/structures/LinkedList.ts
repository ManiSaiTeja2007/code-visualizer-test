import { VariableData } from '../types';

export interface ListNode {
  value: any;
  next: ListNode | null;
  prev?: ListNode | null;
}

export const linkedListVariants = ['singly', 'doubly', 'circular'] as const;
export type LinkedListVariant = typeof linkedListVariants[number];

export function createLinkedListSandbox(variant: LinkedListVariant) {
  const sandbox = {
    list: {
      head: null as ListNode | null,
      tail: null as ListNode | null,
      append(value: any) {
        const newNode: ListNode = { value, next: null, ...(variant === 'doubly' ? { prev: null } : {}) };
        if (!this.head) {
          this.head = newNode;
          this.tail = newNode;
          if (variant === 'circular') newNode.next = newNode;
        } else if (variant === 'circular') {
          newNode.next = this.head;
          this.tail!.next = newNode;
          this.tail = newNode;
        } else if (variant === 'doubly') {
          newNode.prev = this.tail;
          this.tail!.next = newNode;
          this.tail = newNode;
        } else {
          this.tail!.next = newNode;
          this.tail = newNode;
        }
        return this.head;
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { list: { head: ListNode | null } }): VariableData => ({
      list: sandbox.list.head,
      isCircular: variant === 'circular',
    }),
  };
}