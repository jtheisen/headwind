import { observable } from "mobx";
import { types } from "mobx-state-tree";

export const TreeNode = types
  .model("TreeNode", {
    id: types.identifier,
    id2: types.string,
    type: types.string,
    nodeType: types.number,
    tagName: types.optional(types.string, ""),
    textContent: types.optional(types.string, ""),
    children: types.array(types.late(() => TreeNode)),
  })
  .views((self) => ({
    get label() {
      switch (self.nodeType) {
        case Node.ELEMENT_NODE:
          return self.tagName;
        case Node.TEXT_NODE:
          return `"${self.textContent}"`;
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
  latestId: types.number,
  root: TreeNode,
});

let latestId = 0;

function getCorePropsForNode(node) {
  const nextId = (++latestId).toString();
  return {
    id: nextId,
    id2: nextId,
    nodeType: node.nodeType,
  };
}

export function makeDocumentStateFromNode(node) {
  console.error(`Made doc from ${latestId}`);
  const root = makeTreeFromNode(node);
  return makeDocumentStateFromTreeRoot(root, latestId);
}

function makeDocumentStateFromTreeRoot(treeRoot, latestId) {
  return {
    tree: Tree.create({ root: treeRoot, latestId }),
    focusedNode: [],
    selectedNodes: [],
    expandedNodes: [],
  };
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
        ...getCorePropsForNode(node),
        type: "ELEMENT",
        tagName: node.tagName,
        children: [...node.childNodes].map(makeTreeFromNode).filter((n) => n),
      };
    case Node.TEXT_NODE:
      if (!node.textContent || node.textContent.trim() === "") return undefined;

      return {
        ...getCorePropsForNode(node),
        type: "TEXT",
        textContent: node.textContent.trim(),
      };
    default:
      return {
        ...getCorePropsForNode(node),
        type: "UNKNOWN",
      };
  }
}
