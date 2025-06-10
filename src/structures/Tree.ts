import { VariableData } from '../types';

interface TreeNode {
  value: any;
  left: TreeNode | null;
  right: TreeNode | null;
}

export const treeVariants = ['binary', 'bst', 'avl'] as const;
export type TreeVariant = typeof treeVariants[number];

export function createTreeSandbox(variant: TreeVariant) {
  const sandbox = {
    tree: {
      root: null as TreeNode | null,
      insert(value: any) {
        const newNode: TreeNode = { value, left: null, right: null };
        if (!this.root) {
          this.root = newNode;
        } else if (variant === 'avl' || variant === 'bst') {
          let current = this.root;
          while (current) {
            if (value < current.value) {
              if (!current.left) {
                current.left = newNode;
                break;
              }
              current = current.left;
            } else {
              if (!current.right) {
                current.right = newNode;
                break;
              }
              current = current.right;
            }
          }
        } else {
          let current = this.root;
          while (current) {
            if (Math.random() < 0.5) {
              if (!current.left) {
                current.left = newNode;
                break;
              }
              current = current.left;
            } else {
              if (!current.right) {
                current.right = newNode;
                break;
              }
              current = current.right;
            }
          }
        }
        return this.root;
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { tree: { root: TreeNode | null } }): VariableData => ({
      tree: sandbox.tree.root,
    }),
  };
}