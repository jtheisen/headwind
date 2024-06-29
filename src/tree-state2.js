import { types } from "mobx-state-tree";

export const TreeNode = types
  .model({
    id: types.identifier,
    type: types.string,
    tagName: types.optional(types.string, ""),
    text: types.optional(types.string, ""),
    children: types.array(types.late(() => TreeNode)),
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
  root: TreeNode,
});

// export const sampleTree = Tree.create({
//   root: {
//     id: "1",
//     isSelected: false,
//     children: [
//       {
//         id: "2",
//         isSelected: false,
//       },
//       {
//         id: "3",
//         isSelected: false,
//       },
//     ],
//   },
// });

// window.sampleTree = sampleTree;
// console.info(sampleTree);

let latestId = 0;

function getNextId() {
  return (latestId++).toString();
}

export function makeTreeFromNode(node) {
  switch (node.nodeType) {
    case Node.DOCUMENT_NODE:
      return makeTreeFromNode(node.children[0]);
    case Node.ELEMENT_NODE:
      return {
        id: getNextId(),
        type: "ELEMENT",
        tagName: node.tagName,
        children: [...node.childNodes].map(makeTreeFromNode),
      };
    case Node.TEXT_NODE:
      return {
        id: getNextId(),
        type: "TEXT",
        text: node.textContent,
      };
    default:
      return {
        id: getNextId(),
        type: "UNKNOWN",
      };
  }
}
