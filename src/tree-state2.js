import { types } from "mobx-state-tree";

export const TreeNode = types
  .model("TreeNode", {
    id: types.identifier,
    type: types.string,
    nodeType: types.number,
    tagName: types.optional(types.string, ""),
    text: types.optional(types.string, ""),
    children: types.array(types.late(() => TreeNode)),
  })
  .views((self) => ({
    get label() {
      switch (self.nodeType) {
        case Node.ELEMENT_NODE:
          return self.tagName;
        case Node.TEXT_NODE:
          return `"${self.text}"`;
        default:
          return "?" + self.nodeType;
      }
    },
  }))
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
    test() {
      console.info(self.label);
    },
  }));

export const Tree = types.model({
  root: TreeNode,
});

let latestId = 0;

function getNextId() {
  return (++latestId).toString();
}

export function makeTreeFromNode(node) {
  const result = makeTreeFromNodeTemplate(node);

  if (!result) return undefined;

  return TreeNode.create(result);
}

function makeTreeFromNodeTemplate(node) {
  switch (node.nodeType) {
    case Node.DOCUMENT_NODE:
      return makeTreeFromNode(node.children[0]);
    case Node.ELEMENT_NODE:
      return {
        id: getNextId(),
        nodeType: node.nodeType,
        type: "ELEMENT",
        tagName: node.tagName,
        children: [...node.childNodes].map(makeTreeFromNode).filter((n) => n),
      };
    case Node.TEXT_NODE:
      if (!node.textContent || node.textContent.trim() === "") return undefined;

      return {
        id: getNextId(),
        nodeType: node.nodeType,
        type: "TEXT",
        text: node.textContent.trim(),
      };
    default:
      return {
        id: getNextId(),
        nodeType: node.nodeType,
        type: "UNKNOWN",
      };
  }
}
