import { VariableData } from '../types';

export const graphVariants = ['directed', 'undirected', 'weighted'] as const;
export type GraphVariant = typeof graphVariants[number];

export function createGraphSandbox(variant: GraphVariant) {
  const sandbox = {
    graph: {
      nodes: new Map<any, { id: any; neighbors: { id: any; weight?: number }[] }>(),
      addVertex(id: any) {
        if (!this.nodes.has(id)) {
          this.nodes.set(id, { id, neighbors: [] });
        }
        return Array.from(this.nodes.values());
      },
      addEdge(from: any, to: any, weight?: number) {
        if (this.nodes.has(from) && this.nodes.has(to)) {
          const edge = { id: to, ...(variant === 'weighted' ? { weight } : {}) };
          this.nodes.get(from)!.neighbors.push(edge);
          if (variant === 'undirected') {
            const reverseEdge = { id: from }; // No weight for undirected unless specified
            this.nodes.get(to)!.neighbors.push(reverseEdge);
          }
        }
        return Array.from(this.nodes.values());
      },
    },
  };

  return {
    sandbox,
    getVariables: (sandbox: { graph: { nodes: Map<any, any> } }): VariableData => ({
      graph: Array.from(sandbox.graph.nodes.values()),
    }),
  };
}