import { Type } from '@nestjs/common';

export const types: Type<unknown>[] = [String, Boolean, Number, Array, Object, Function];

type Modifier = 'readonly' | 'optional' | 'none';
type Replace<O extends Record<string, unknown>, K extends keyof O, T, M extends Modifier = 'none'> = Omit<O, K> &
  (M extends 'readonly'
    ? M extends 'optional'
      ? { readonly [P in K]?: T }
      : { readonly [P in K]: T }
    : M extends 'optional'
    ? { [P in K]?: T }
    : { [P in K]: T });
type PartProp<O extends Record<string, unknown>, K extends keyof O> = Omit<O, K> & { [P in K]+?: O[P] };

type Node<T> = {
  key: string;
  inputs: string[];
  outputs: string[];
  value: T;
};

type TopoProcess<T> = {
  findKey: (node: T) => string | undefined;
  findInputs: (node: T) => Array<string | undefined>;
};

export const topoSort = <T>(objects: T[], process: TopoProcess<T>): T[] | undefined => {
  type PartKey = PartProp<Node<T>, 'key'>;
  type NullableInput = Replace<Node<T>, 'inputs', Array<string | undefined>>;

  const nodes = objects
    .map<PartKey>(object => ({ key: process.findKey(object), value: object, inputs: [], outputs: [] }))
    .filter((n): n is Node<T> => n.key !== undefined)
    .map<NullableInput>(n => ({ ...n, inputs: process.findInputs(n.value) }))
    .map(n => ({ ...n, inputs: n.inputs.filter((n): n is string => n !== undefined) }))
    .map<Node<T>>((n, _i, arr) => {
      n.inputs.forEach(input => arr.find(a => a.key === input)?.outputs.push(n.key));
      return n as Node<T>;
    });

  const roots = nodes.filter(n => !n.inputs.length);
  const sortedNodes = Array.from<Node<T>>([]);

  while (roots.length) {
    const node = roots.pop()!;
    sortedNodes.push(node);

    node.outputs.forEach((e, i, arr) => {
      const m = nodes.find(n => n.key === e)!;

      arr[i] = undefined!;
      const inputIdx = m.inputs.findIndex(input => input === e);
      m.inputs[inputIdx] = undefined!;

      if (!m.inputs.length) roots.push(m);
    });
  }

  const edges = nodes.flatMap(n => [...n.inputs, ...n.outputs]);
  if (edges) return undefined;

  return sortedNodes.map(n => n.value);
};
