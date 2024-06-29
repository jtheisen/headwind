import { types } from "mobx-state-tree";

// index: "root",
// canMove: true,
// isFolder: true,
// children: ["child1"],
// data: "Root item",
// canRename: true,

export const Node = types
  .model({
    index: types.identifier,
    canMove: false,
    isFolder: true,
    data: "some item",
    isSelected: false,
    tree: types.reference(types.late(() => Tree)),
    children: types.array(types.reference(types.late(() => Node))),
  })
  .actions((self) => ({
    addChild() {
      self.tree.createNode((newNode) => self.children.push(newNode.index));
    },
    setIsSelected(v) {
      self.isSelected = v;
    },
  }));

export const Tree = types
  .model({
    index: types.identifier,
    latestId: types.number,
    nodes: types.map(Node),
    root: types.reference(Node),
  })
  .actions((self) => ({
    createNode(insert) {
      const newId = (++self.latestId).toString();
      const newNode = {
        index: newId,
        isSelected: false,
        tree: self,
      };
      self.nodes.put(newNode);
      insert(newNode);
      return newNode;
    },
  }));

export const sampleTree = Tree.create({
  index: "tree",
  latestId: 3,
  nodes: {
    1: {
      index: "1",
      tree: "tree",
      isSelected: false,
      children: ["2", "3"],
    },
    2: {
      index: "2",
      tree: "tree",
      isSelected: false,
    },
    3: {
      index: "3",
      tree: "tree",
      isSelected: false,
    },
  },
  root: "1",
});

window.sampleTree = sampleTree;
console.info(sampleTree);

// export function makeTreeFromNode(node) {
//   switch (node.nodeType) {
//     case Node.DOCUMENT_NODE:
//       return makeTreeFromNode(node.children[0]);
//     case Node.ELEMENT_NODE:
//       return new OElement(
//         node.tagName,
//         [...node.childNodes].map(makeTreeFromNode)
//       );
//     case Node.TEXT_NODE:
//       return new OText(node.textContent);
//     default:
//       return new OUnknown();
//   }
// }
