import React, { useState } from "react";
import DataStructureVisualizer from "./components/DataStructureVisualizer";

type VariantType = {
  array: ("static" | "dynamic" | "multi-dimensional")[];
  linkedlist: ("singly" | "doubly" | "circular")[];
  stack: ("array-based" | "linkedlist-based")[];
  queue: ("array-based" | "circular" | "priority" | "deque")[];
  tree: ("binary" | "bst" | "avl")[];
  heap: ("min-heap" | "max-heap" | "binomial")[];
  graph: ("directed" | "undirected" | "weighted")[];
  hashtable: ("separate-chaining" | "linear-probing")[];
};

export default function App() {
  const [selectedStructure, setSelectedStructure] =
    useState<keyof VariantType>("heap");
  const [selectedVariant, setSelectedVariant] =
    useState<VariantType[keyof VariantType][number]>("max-heap");

  const variants: VariantType = {
    array: ["static", "dynamic", "multi-dimensional"],
    linkedlist: ["singly", "doubly", "circular"],
    stack: ["array-based", "linkedlist-based"],
    queue: ["array-based", "circular", "priority", "deque"],
    tree: ["binary", "bst", "avl"],
    heap: ["min-heap", "max-heap", "binomial"],
    graph: ["directed", "undirected", "weighted"],
    hashtable: ["separate-chaining", "linear-probing"],
  };

  const defaultCodes: {
    [key in keyof VariantType]: { [key: string]: string };
  } = {
    array: {
      static: `array.push(10);\narray.push(20);\narray.pop();`,
      dynamic: `array.push(10);\narray.push(20);\narray.pop();`,
      "multi-dimensional": `array.set(0, 0, 10);\narray.set(0, 1, 20);\narray.set(1, 0, 30);`,
    },
    linkedlist: {
      singly: `list.append(10);\nlist.append(20);\nlist.append(5);`,
      doubly: `list.append(10);\nlist.append(20);\nlist.append(5);`,
      circular: `list.append(10);\nlist.append(20);\nlist.append(5);`,
    },
    stack: {
      "array-based": `stack.push(10);\nstack.push(20);\nstack.pop();`,
      "linkedlist-based": `stack.push(10);\nstack.push(20);\nstack.pop();`,
    },
    queue: {
      "array-based": `queue.enqueue(10);\nqueue.enqueue(20);\nqueue.dequeue();`,
      circular: `queue.enqueue(10);\nqueue.enqueue(20);\nqueue.dequeue();`,
      priority: `queue.enqueue(10, 1);\nqueue.enqueue(20, 2);\nqueue.dequeue();`,
      deque: `queue.pushBack(10);\nqueue.pushFront(20);\nqueue.popFront();`,
    },
    tree: {
      binary: `tree.insert(10);\ntree.insert(5);\ntree.insert(15);`,
      bst: `tree.insert(10);\ntree.insert(5);\ntree.insert(15);`,
      avl: `tree.insert(10);\ntree.insert(5);\ntree.insert(15);`,
    },
    heap: {
      "max-heap": `heap.pushToHeap(10);\nheap.pushToHeap(20);\nheap.pushToHeap(5);\nheap.popFromHeap();`,
      "min-heap": `heap.pushToHeap(10);\nheap.pushToHeap(20);\nheap.pushToHeap(5);\nheap.popFromHeap();`,
      binomial: `heap.insert(10);\nheap.insert(20);\nheap.extractMin();`,
    },
    graph: {
      directed: `graph.addVertex(1);\ngraph.addVertex(2);\ngraph.addEdge(1, 2);`,
      undirected: `graph.addVertex(1);\ngraph.addVertex(2);\ngraph.addEdge(1, 2);`,
      weighted: `graph.addVertex(1);\ngraph.addVertex(2);\ngraph.addEdge(1, 2, 5);`,
    },
    hashtable: {
      "separate-chaining": `hash.put(1, "one");\nhash.put(2, "two");\nhash.get(1);`,
      "linear-probing": `hash.put(1, "one");\nhash.put(2, "two");\nhash.get(1);`,
    },
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 flex space-x-4">
        <div>
          <label htmlFor="structure-select" className="text-lg font-bold mr-2">
            Select Data Structure:
          </label>
          <select
            id="structure-select"
            value={selectedStructure}
            onChange={(e) => {
              const newStructure = e.target.value as keyof VariantType;
              setSelectedStructure(newStructure);
              setSelectedVariant(variants[newStructure][0]);
            }}
            className="p-2 border rounded"
          >
            {Object.keys(variants).map((structure) => (
              <option key={structure} value={structure}>
                {structure.charAt(0).toUpperCase() +
                  structure.slice(1).replace("hashtable", "Hash Table")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="variant-select" className="text-lg font-bold mr-2">
            Select Variant:
          </label>
          <select
            id="variant-select"
            value={selectedVariant}
            onChange={(e) =>
              setSelectedVariant(
                e.target.value as VariantType[keyof VariantType][number]
              )
            }
            className="p-2 border rounded"
          >
            {variants[selectedStructure].map((variant) => (
              <option key={variant} value={variant}>
                {variant.charAt(0).toUpperCase() +
                  variant.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataStructureVisualizer
        structure={selectedStructure}
        variant={selectedVariant}
        defaultCode={defaultCodes[selectedStructure][selectedVariant]}
      />
    </div>
  );
}
