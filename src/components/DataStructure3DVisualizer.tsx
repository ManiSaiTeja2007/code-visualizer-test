import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface Node {
  value: any;
  next?: Node | null;
  prev?: Node | null;
  left?: Node | null;
  right?: Node | null;
}

interface GraphNode {
  id: any;
  neighbors: { id: any; weight?: number }[];
}

interface NodeProps {
  position: [number, number, number];
  value: any;
  index?: number;
  data: any[] | Node | GraphNode[] | { [key: string]: any } | null;
  type: string;
  variant?: string;
  isCircular?: boolean;
}

function VisualNode({
  position,
  value,
  index = 0,
  data,
  type,
  variant,
  isCircular,
}: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const lines: React.JSX.Element[] = [];
  const [x, y, z] = position;

  if (type === "heap" && Array.isArray(data)) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    if (left < data.length) {
      const childX = x - 2 / (y + 1);
      const childY = y - 1.5;
      lines.push(
        <Line
          key={`left-${index}`}
          points={[
            [x, y, z],
            [childX, childY, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    if (right < data.length) {
      const childX = x + 2 / (y + 1);
      const childY = y - 1.5;
      lines.push(
        <Line
          key={`right-${index}`}
          points={[
            [x, y, z],
            [childX, childY, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    return (
      <group>
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
        {lines}
        {left < data.length && (
          <VisualNode
            position={[x - 2 / (y + 1), y - 1.5, z]}
            value={data[left]}
            index={left}
            data={data}
            type={type}
            variant={variant}
          />
        )}
        {right < data.length && (
          <VisualNode
            position={[x + 2 / (y + 1), y - 1.5, z]}
            value={data[right]}
            index={right}
            data={data}
            type={type}
            variant={variant}
          />
        )}
      </group>
    );
  } else if ((type === "stack" || type === "queue") && data) {
    return (
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
    );
  } else if (type === "tree" && data) {
    const node = data as Node;
    if (node.left) {
      const childX = x - 2 / (y + 1);
      const childY = y - 1.5;
      lines.push(
        <Line
          key={`left-${value}`}
          points={[
            [x, y, z],
            [childX, childY, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    if (node.right) {
      const childX = x + 2 / (y + 1);
      const childY = y - 1.5;
      lines.push(
        <Line
          key={`right-${value}`}
          points={[
            [x, y, z],
            [childX, childY, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    return (
      <group>
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
        {lines}
        {node.left && (
          <VisualNode
            position={[x - 2 / (y + 1), y - 1.5, z]}
            value={node.left.value}
            data={node.left}
            type={type}
            variant={variant}
          />
        )}
        {node.right && (
          <VisualNode
            position={[x + 2 / (y + 1), y - 1.5, z]}
            value={node.right.value}
            data={node.right}
            type={type}
            variant={variant}
          />
        )}
      </group>
    );
  } else if (type === "linkedlist" && data) {
    const node = data as Node;
    if (node.next && (variant !== "doubly" || node.next !== node.prev)) {
      const nextX = x + 2;
      lines.push(
        <Line
          key={`next-${value}`}
          points={[
            [x, y, z],
            [nextX, y, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    if (variant === "doubly" && node.prev) {
      const prevX = x - 2;
      lines.push(
        <Line
          key={`prev-${value}`}
          points={[
            [x, y, z],
            [prevX, y, z],
          ]}
          color="black"
          lineWidth={2}
        />
      );
    }
    return (
      <group>
        <mesh ref={meshRef} position={position}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
        {lines}
        {node.next && (variant !== "doubly" || node.next !== node.prev) && (
          <VisualNode
            position={[x + 2, y, z]}
            value={node.next.value}
            data={node.next}
            type={type}
            variant={variant}
            isCircular={isCircular}
          />
        )}
        {variant === "doubly" && node.prev && (
          <VisualNode
            position={[x - 2, y, z]}
            value={node.prev.value}
            data={node.prev}
            type={type}
            variant={variant}
            isCircular={isCircular}
          />
        )}
        {isCircular && node.next === data && (
          <Line
            key={`circular-${value}`}
            points={[
              [x, y, z],
              [x + 2, y + 1, z],
              [0, y + 1, z],
              [0, y, z],
            ]}
            color="black"
            lineWidth={2}
          />
        )}
      </group>
    );
  } else if (type === "graph" && Array.isArray(data)) {
    const nodePositions: { [id: string]: [number, number, number] } = {};
    data.forEach((node, i) => {
      nodePositions[node.id] = [(i % 5) * 2 - 4, 3 - Math.floor(i / 5) * 2, 0];
    });
    lines.push(
      ...data.flatMap((node) =>
        node.neighbors.map((neighbor: any) => (
          <Line
            key={`${node.id}-${neighbor.id}`}
            points={[nodePositions[node.id], nodePositions[neighbor.id]]}
            color="black"
            lineWidth={2}
          />
        ))
      )
    );
    return (
      <group>
        <mesh ref={meshRef} position={position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
        {lines}
      </group>
    );
  } else if (type === "hashtable") {
    return (
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4CAF50" />
      </mesh>
    );
  }
  return null;
}

interface DataStructure3DVisualizerProps {
  type: string;
  data: any[] | Node | GraphNode[] | { [key: string]: any } | null;
  variant?: string;
  isCircular?: boolean;
}

export default function DataStructure3DVisualizer({
  type,
  data,
  variant,
  isCircular,
}: DataStructure3DVisualizerProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">3D Visualization</h2>
      <Canvas
        style={{ height: "300px" }}
        camera={{ position: [0, 0, 10], fov: 75 }}
      >
        <color attach="background" args={["#f0f0f0"]} />
        {type === "heap" && Array.isArray(data) && data.length > 0 && (
          <VisualNode
            position={[0, 3, 0]}
            value={data[0]}
            index={0}
            data={data}
            type={type}
            variant={variant}
          />
        )}
        {(type === "stack" || type === "queue") &&
          Array.isArray(data) &&
          data.length > 0 &&
          data.map((value, i) => (
            <VisualNode
              key={i}
              position={
                type === "stack" ? [0, 3 - i * 1.5, 0] : [i * 2 - 2, 3, 0]
              }
              value={value}
              data={data}
              type={type}
              variant={variant}
            />
          ))}
        {(type === "stack" || type === "queue") &&
          !Array.isArray(data) &&
          data && (
            <VisualNode
              position={[0, 3, 0]}
              value={data.value}
              data={data}
              type={type}
              variant={variant}
            />
          )}
        {(type === "tree" || type === "linkedlist") && data && (
          <VisualNode
            position={[0, 3, 0]}
            value={(data as any).value}
            data={data}
            type={type}
            variant={variant}
            isCircular={isCircular}
          />
        )}
        {type === "graph" &&
          Array.isArray(data) &&
          data.map((node, i) => (
            <VisualNode
              key={node.id}
              position={[(i % 5) * 2 - 4, 3 - Math.floor(i / 5) * 2, 0]}
              value={node.id}
              data={data}
              type={type}
              variant={variant}
            />
          ))}
        {type === "hashtable" &&
          data &&
          Object.values(data)
            .filter((v) => v)
            .map((entry: any, i) => (
              <VisualNode
                key={i}
                position={[(i % 5) * 2 - 4, 3 - Math.floor(i / 5) * 2, 0]}
                value={`${entry.key}:${entry.value}`}
                data={data}
                type={type}
                variant={variant}
              />
            ))}
      </Canvas>
    </div>
  );
}
