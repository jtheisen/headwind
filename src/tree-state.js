import { types } from "mobx-state-tree";

export const Node = types
  .model({
    id: types.identifier,
    isSelected: false,
    children: types.array(types.reference(types.late(() => Node))),
  })
  .actions((self) => ({
    addChild() {},
    setIsSelected(v) {
      self.isSelected = v;
    },
  }));

export const Tree = types.model({
  nodes: types.map(Node),
  root: types.reference(Node),
});

export const sampleTree = Tree.create({
  nodes: {
    1: {
      id: "1",
      isSelected: false,
      children: ["2", "3"],
    },
    2: {
      id: "2",
      isSelected: false,
    },
    3: {
      id: "3",
      isSelected: false,
    },
  },
  root: "1",
});

window.sampleTree = sampleTree;

console.info(sampleTree);
