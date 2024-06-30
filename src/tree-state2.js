import { observable } from "mobx";
import { types } from "mobx-state-tree";
import { convertAttributeNameFromDomToReact } from "./dom";

export const ClassNode = types
  .model({
    tailwind: types.boolean,
    plugin: types.optional(types.string, ""),
    ns: types.optional(types.string, ""),
    cls: types.string,
    hasValue: types.boolean,
  })
  .views((self) => ({
    get value() {
      if (!self.tailwind)
        throw Error(`Can't get value from non-tailwind class`);
      return self.cls.substring(0, self.ns.length + 1);
    },
    set value(v) {
      if (!self.tailwind) throw Error(`Can't set value for non-tailwind class`);
      self.cls = `${self.ns}-${self.value}`;
    },
  }));

export const TreeNode = types
  .model("TreeNode", {
    id: types.identifier,
    id2: types.string,
    type: types.string,
    nodeType: types.number,
    classes: types.array(ClassNode),
    styles: types.map(types.string),
    attributes: types.map(types.string),
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

export function createDocumentFactory(resolveClass) {
  let latestId = 0;

  function getCorePropsForNode(node) {
    const nextId = (++latestId).toString();
    return {
      id: nextId,
      id2: nextId,
      nodeType: node.nodeType,
    };
  }

  function makeDocumentStateFromNode(node) {
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

  function makeTreeFromNode(node) {
    const result = makeTreeFromNodeTemplate(node);

    if (!result) return undefined;

    return TreeNode.create(result);
  }

  function makeTreeFromNodeTemplate(node) {
    switch (node.nodeType) {
      case Node.DOCUMENT_NODE:
        return makeTreeFromNode(node.children[0]);
      case Node.ELEMENT_NODE:
        const style = node.attributes.style;
        return {
          ...getCorePropsForNode(node),
          type: "ELEMENT",
          tagName: node.tagName.toLowerCase(),
          styles: {}, //style ? style.value.split(";").map((s) => s.trim()) : [],
          classes: [...node.classList].map(resolveClass),
          attributes: Object.fromEntries(
            [...node.attributes]
              .filter((a) => !["class", "style"].includes(a.name))
              .map((a) => [convertAttributeNameFromDomToReact(a.name), a.value])
          ),
          children: [...node.childNodes].map(makeTreeFromNode).filter((n) => n),
        };
      case Node.TEXT_NODE:
        if (!node.textContent || node.textContent.trim() === "")
          return undefined;

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
  return { makeDocumentStateFromNode };
}
