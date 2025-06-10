import { useEffect, useRef } from "react";

interface Node {
  value: any;
  next?: Node | null;
  prev?: any;
  left?: Node | null;
  right?: Node | null;
}

interface GraphNode {
  id: any;
  neighbors: { id: any; weight?: number }[];
}

interface DataStructure2DVisualizerProps {
  type: string;
  data?: any[] | Node | { [key: string]: any } | GraphNode[] | null;
  variant?: string;
  isCircular?: boolean;
}

export default function DataStructure2DVisualizer({
  type,
  data,
  variant,
  isCircular,
}: DataStructure2DVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nodeRadius = 20;
    const levelHeight = 60;
    const startX = canvas.width / 2;

    if (type === "array" && Array.isArray(data)) {
      const itemWidth = 50;
      const startY = 50;
      data.forEach((value, index) => {
        const x = 50 + index * (itemWidth + 10);
        const y =
          variant === "multi-dimensional"
            ? 50 + Math.floor(index / 2) * 50
            : startY;
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x - 25, y - 20, itemWidth, 40);
        ctx.strokeRect(x - 25, y - 20, itemWidth, 40);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(value?.toString() || "", x, y + 5);
      });
    } else if (type === "linkedlist" && data) {
      let current: Node | null = data as Node; // Fix: Allow null
      let x = 50;
      const y = 50;
      const nodes: Node[] = [];
      while (current && !nodes.includes(current)) {
        nodes.push(current);
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x - 25, y - 20, 50, 40);
        ctx.strokeRect(x - 25, y - 20, 50, 40);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(current.value.toString(), x, y + 5);
        if (
          current.next &&
          (variant !== "doubly" || current.next !== current.prev)
        ) {
          ctx.beginPath();
          ctx.moveTo(x + 25, y);
          ctx.lineTo(x + 50, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + 50, y - 10);
          ctx.lineTo(x + 50, y + 10);
          ctx.lineTo(x + 60, y);
          ctx.stroke();
        }
        if (
          variant === "doubly" &&
          current.prev &&
          !nodes.includes(current.prev)
        ) {
          ctx.beginPath();
          ctx.moveTo(x - 25, y);
          ctx.lineTo(x - 50, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x - 50, y - 10);
          ctx.lineTo(x - 50, y + 10);
          ctx.lineTo(x - 60, y);
          ctx.stroke();
        }
        x += 75;
        current = current.next ?? null;
      }
      if (isCircular && nodes.length > 0) {
        const lastX = 50 + (nodes.length - 1) * 75;
        ctx.beginPath();
        ctx.moveTo(lastX + 25, y);
        ctx.lineTo(lastX + 50, y);
        ctx.quadraticCurveTo(lastX + 75, y + 50, 50 - 25, y + 50);
        ctx.lineTo(50 - 25, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(50 - 25, y - 10);
        ctx.lineTo(50 - 25, y + 10);
        ctx.lineTo(50 - 35, y);
        ctx.stroke();
      }
    } else if ((type === "stack" || type === "queue") && data) {
      const itemHeight = 40;
      const startY = 50;
      const arrayData = Array.isArray(data) ? data : [];
      const linkedData = !Array.isArray(data) ? data : null;
      if (arrayData.length > 0) {
        arrayData.forEach((value, index) => {
          const x = type === "stack" ? startX : 50 + index * 60;
          const y = type === "stack" ? startY + index * itemHeight : startY;
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(x - 25, y - 20, 50, 40);
          ctx.strokeRect(x - 25, y - 20, 50, 40);
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.fillText(value.toString(), x, y + 5);
        });
      } else if (linkedData) {
        let current: Node | null = linkedData as Node; // Fix: Allow null
        let x = 50;
        const y = 50; // Fix: Define y
        const nodes: Node[] = [];
        while (current && !nodes.includes(current)) {
          nodes.push(current);
          ctx.fillStyle = "#4CAF50";
          ctx.fillRect(x - 25, y - 20, 50, 40);
          ctx.strokeRect(x - 25, y - 20, 50, 40);
          ctx.fillStyle = "#fff";
          ctx.textAlign = "center";
          ctx.fillText(current.value.toString(), x, y + 5);
          if (current.next) {
            ctx.beginPath();
            ctx.moveTo(x + 25, y);
            ctx.lineTo(x + 50, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 50, y - 10);
            ctx.lineTo(x + 50, y + 10);
            ctx.lineTo(x + 60, y);
            ctx.stroke();
          }
          x += 75;
          current = current.next ?? null;
        }
      }
    } else if (type === "tree" && data) {
      const drawTreeNode = (
        node: Node,
        x: number,
        y: number,
        level: number
      ) => {
        if (!node) return;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(node.value.toString(), x, y + 5);
        if (node.left) {
          const childX = x - 100 / (level + 1);
          const childY = y + levelHeight;
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(childX, childY - nodeRadius);
          ctx.stroke();
          drawTreeNode(node.left, childX, childY, level + 1);
        }
        if (node.right) {
          const childX = x + 100 / (level + 1);
          const childY = y + levelHeight;
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(childX, childY - nodeRadius);
          ctx.stroke();
          drawTreeNode(node.right, childX, childY, level + 1);
        }
      };
      drawTreeNode(data as Node, startX, 50, 1);
    } else if (type === "heap" && Array.isArray(data) && data.length > 0) {
      const drawNode = (x: number, y: number, value: number, index: number) => {
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x, y + 5);
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        if (left < data.length) {
          const leftChildX = x - 100 / (y / levelHeight + 1);
          const leftChildY = y + levelHeight;
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(leftChildX, leftChildY + 10);
          ctx.stroke();
          drawNode(leftChildX, y + levelHeight, data[left], left);
        }
        if (right < data.length) {
          const rightChildX = x + 100 / (y / levelHeight + 1);
          const rightChildY = y + levelHeight;
          ctx.beginPath();
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(rightChildX, rightChildY + 10);
          ctx.stroke();
          drawNode(rightChildX, y + levelHeight, data[right], right);
        }
      };
      drawNode(startX, 50, data[0], 0);
    } else if (type === "graph" && Array.isArray(data)) {
      const nodePositions: { [id: string]: { x: number; y: number } } = {};
      data.forEach((node: any, i) => {
        const x = 50 + (i % 5) * 80;
        const y = 50 + Math.floor(i / 5) * 80;
        nodePositions[node.id] = { x, y };
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#4CAF50";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(node.id.toString(), x, y + 5);
      });
      data.forEach((node: any) => {
        node.neighbors.forEach((neighbor: any) => {
          const from = nodePositions[node.id];
          const to = nodePositions[neighbor.id];
          if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            if (variant === "directed") {
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const angle = Math.atan2(dy, dx);
              ctx.beginPath();
              ctx.moveTo(to.x - dx, to.y - dy);
              ctx.lineTo(
                to.x - (nodeRadius + 10) * Math.cos(angle - 0.2),
                to.y - (nodeRadius + 10) * Math.sin(angle - 0.2)
              );
              ctx.lineTo(
                to.x - (nodeRadius + 10) * Math.cos(angle + 0.2),
                to.y - (nodeRadius + 10) * Math.sin(angle + 0.2)
              );
              ctx.fillStyle = "#000";
              ctx.fill();
            }
            if (neighbor.weight) {
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              ctx.fillStyle = "#000";
              ctx.fillText(neighbor.weight.toString(), midX, midY - 5);
            }
          }
        });
      });
    } else if (type === "hashtable" && data) {
      const entries = Array.isArray(data)
        ? data.flatMap((bucket: any) => bucket || [])
        : Object.values(data.value() || {});
      entries.forEach((entry: any, i: number) => {
        const x = 50 + (i % 5) * 80;
        const y = 50 + Math.floor(i / 5) * 80;
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(x - 30, y - 20, 60, 40);
        ctx.strokeRect(x - 30, y - 20, 60, 40);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.fillText(`${entry.key}:${entry.value}`, x, y + 5);
      });
    }
  }, [type, data, variant, isCircular]);

  return <canvas ref={canvasRef} width={400} height={300} className="border" />;
}
