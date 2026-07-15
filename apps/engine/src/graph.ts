/**
 * Sort workflow nodes so parents run before children.
 * Example: Timer → HTTP → Mail  runs in that order.
 */

export type GraphNode = {
  id: string;
  type: string;
  data: {
    kind: string;
    metadata?: any;
  };
  credentials?: any;
};

export type GraphEdge = {
  source: string;
  target: string;
};

export function sortNodes(nodes: GraphNode[], edges: GraphEdge[]): GraphNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // How many incoming edges each node has
  const incoming = new Map<string, number>();
  for (const node of nodes) {
    incoming.set(node.id, 0);
  }
  for (const edge of edges) {
    if (incoming.has(edge.target)) {
      incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
    }
  }

  // Children of each node
  const children = new Map<string, string[]>();
  for (const node of nodes) {
    children.set(node.id, []);
  }
  for (const edge of edges) {
    children.get(edge.source)?.push(edge.target);
  }

  // Start with nodes that have no parents (triggers)
  const queue: string[] = [];
  for (const [id, count] of incoming) {
    if (count === 0) queue.push(id);
  }

  const sorted: GraphNode[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = byId.get(id);
    if (node) sorted.push(node);

    for (const childId of children.get(id) || []) {
      const left = (incoming.get(childId) || 0) - 1;
      incoming.set(childId, left);
      if (left === 0) queue.push(childId);
    }
  }

  // If cycle or orphaned nodes, append leftovers
  if (sorted.length < nodes.length) {
    for (const node of nodes) {
      if (!sorted.find((n) => n.id === node.id)) {
        sorted.push(node);
      }
    }
  }

  return sorted;
}
