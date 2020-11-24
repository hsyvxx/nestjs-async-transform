import { Type } from '@nestjs/common';

export const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];

type Node<T> = {
  key: string;
  inputs: string[];
  outputs: string[];
  value: T;
};

type TopoProcess<T> = {
  findKey: (node: T) => string;
  findInputs: (node: T) => string[];
};

export const topoSort = <T>(objects: T[], process: TopoProcess<T>): T[] | undefined => {
  const nodes = objects.map<Node<T>>(object => ({
    key: process.findKey(object),
    value: object,
    inputs: [...process.findInputs(object)],
    outputs: [],
  }));

  nodes.forEach(node => {
    node.inputs = node.inputs.filter(input => {
      return nodes.find(node => node.key === input) !== undefined;
    });
    node.inputs.forEach(input => {
      nodes.find(a => a.key === input).outputs.push(node.key);
    });
  });

  const roots = nodes.filter(n => !n.inputs.length);
  const sortedNodes = Array.from<Node<T>>([]);

  while (roots.length) {
    const root = roots.pop();
    sortedNodes.push(root);

    while (root.outputs.length) {
      const output = root.outputs.pop();
      const node = nodes.find(n => n.key === output);
      const inputIdx = node.inputs.findIndex(input => input === root.key);
      node.inputs.splice(inputIdx, 1);
      if (!node.inputs.length) roots.push(node);
    }
  }

  const edges = nodes.flatMap(n => [...n.inputs, ...n.outputs]).filter(d => d);
  if (edges.length) return undefined;

  return sortedNodes.map(n => n.value);
};
