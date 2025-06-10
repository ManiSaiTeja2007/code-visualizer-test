import { useState } from "react";
import CodeEditor from "./CodeEditor";
import VariableTable from "./VariableTable";
import DataStructure2DVisualizer from "./DataStructure2DVisualizer";
import DataStructure3DVisualizer from "./DataStructure3DVisualizer";
import { VariableData } from "../types";
import { createArraySandbox } from "../structures/Array";
import { createLinkedListSandbox } from "../structures/LinkedList";
import { createStackSandbox } from "../structures/Stack";
import { createQueueSandbox } from "../structures/Queue";
import { createTreeSandbox } from "../structures/Tree";
import { createHeapSandbox } from "../structures/Heap";
import { createGraphSandbox } from "../structures/Graph";
import { createHashTableSandbox } from "../structures/HashTable";

interface DataStructureVisualizerProps {
  structure: string;
  variant: string;
  defaultCode: string;
}

export default function DataStructureVisualizer({
  structure,
  variant,
  defaultCode,
}: DataStructureVisualizerProps) {
  const [variables, setVariables] = useState<VariableData>({});
  const [error, setError] = useState<string | null>(null);

  const sandboxes: { [key: string]: any } = {
    array: createArraySandbox,
    linkedlist: createLinkedListSandbox,
    stack: createStackSandbox,
    queue: createQueueSandbox,
    tree: createTreeSandbox,
    heap: createHeapSandbox,
    graph: createGraphSandbox,
    hashtable: createHashTableSandbox,
  };

  const executeCode = (code: string) => {
    try {
      const createSandbox = sandboxes[structure];
      if (!createSandbox)
        throw new Error(`Unsupported structure: ${structure}`);

      const { sandbox, getVariables } = createSandbox(variant);
      for (const key in sandbox) {
        if (typeof sandbox[key] === "object" && sandbox[key]) {
          for (const method in sandbox[key]) {
            if (typeof sandbox[key][method] === "function") {
              sandbox[key][method] = sandbox[key][method].bind(sandbox[key]);
            }
          }
        }
      }

      const wrappedCode = `
        (function(${structure}) {
          ${code}
          return { ${structure} };
        }).call(this, sandbox.${structure});
      `;
      const result = eval(wrappedCode);
      setVariables(getVariables(sandbox));
      setError(null);
    } catch (e: any) {
      setVariables({});
      setError(`Error: ${e.message}`);
      console.error("Execution error:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <CodeEditor onRun={executeCode} error={error} defaultCode={defaultCode} />
      <div className="flex flex-1">
        <div className="w-1/2">
          <VariableTable variables={variables} />
        </div>
        <div className="w-1/2">
          <DataStructure2DVisualizer
            type={structure}
            data={variables[structure] || null}
            variant={variant}
            isCircular={variables.isCircular || false}
          />
          <DataStructure3DVisualizer
            type={structure}
            data={variables[structure] || null}
            variant={variant}
            isCircular={variables.isCircular || false}
          />
        </div>
      </div>
    </div>
  );
}
