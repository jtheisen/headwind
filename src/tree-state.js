import { types } from "mobx-state-tree";

export const Node = types
  .model({
    id: types.identifier,
    isSelected: false,
    tree: types.reference(types.late(() => Tree)),
    children: types.array(types.reference(types.late(() => Node))),
  })
  .actions((self) => ({
    addChild() {
      self.tree.createNode((newNode) => self.children.push(newNode.id));
    },
    setIsSelected(v) {
      self.isSelected = v;
    },
  }));

export const Tree = types
  .model({
    id: types.identifier,
    latestId: types.number,
    nodes: types.map(Node),
    root: types.reference(Node),
  })
  .actions((self) => ({
    createNode(insert) {
      const newId = (++self.latestId).toString();
      const newNode = {
        id: newId,
        isSelected: false,
        tree: self,
      };
      self.nodes.put(newNode);
      insert(newNode);
      return newNode;
    },
  }));

export const sampleTree = Tree.create({
  id: "tree",
  latestId: 3,
  nodes: {
    1: {
      id: "1",
      tree: "tree",
      isSelected: false,
      children: ["2", "3"],
    },
    2: {
      id: "2",
      tree: "tree",
      isSelected: false,
    },
    3: {
      id: "3",
      tree: "tree",
      isSelected: false,
    },
  },
  root: "1",
});

window.sampleTree = sampleTree;

console.info(sampleTree);
