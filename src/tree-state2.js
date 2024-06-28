import { types } from "mobx-state-tree";

export const Node = types
  .model({
    id: types.identifier,
    isSelected: false,
    children: types.array(types.late(() => Node)),
  })
  .actions((self) => ({
    addChild() {
      self.children.push({
        id: "x",
        isSelected: false,
      });
    },
    setIsSelected(v) {
      self.isSelected = v;
    },
  }));

export const Tree = types.model({
  root: Node,
});

export const sampleTree = Tree.create({
  root: {
    id: "1",
    isSelected: false,
    children: [
      {
        id: "2",
        isSelected: false,
      },
      {
        id: "3",
        isSelected: false,
      },
    ],
  },
});

window.sampleTree = sampleTree;

console.info(sampleTree);
