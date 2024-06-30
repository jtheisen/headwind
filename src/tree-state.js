import { observable } from "mobx";
import {
  types,
  getParent,
  getParentOfType,
  hasParentOfType,
  resolveIdentifier,
} from "mobx-state-tree";
import { convertAttributeNameFromDomToReact } from "./dom";
import { logValueTemporarily } from "./utils";

export const ClassNode = types
  .model({
    tailwind: types.boolean,
    plugin: types.optional(types.string, ""),
    ns: types.optional(types.string, ""),
    cls: types.string,
    hasValue: types.boolean,
  })
  .actions((self) => ({
    setClass(cls) {
      self.cls = cls;
    },
  }))
  .views((self) => ({
    get value() {
      if (!self.tailwind)
        throw Error(`Can't get value from non-tailwind class`);
      return self.cls.substring(self.ns.length + 1);
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
    get parent() {
      if (!hasParentOfType(self, TreeNode)) return undefined;

      return getParentOfType(self, TreeNode);
    },
  }))
  .actions((self) => ({
    addTailwindClass({ plugin, ns, cls }) {
      self.classes.push({ tailwind: true, hasValue: true, plugin, ns, cls });
    },
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

export const Tree = types
  .model({
    latestId: types.number,
    root: TreeNode,
  })
  .views((self) => ({
    findById(id) {
      return resolveIdentifier(TreeNode, self, id);
    },
  }));

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
    const root = makeTreeFromNode(node);
    return makeDocumentStateFromTreeRoot(root, latestId);
  }

  function makeDocumentStateFromTreeRoot(treeRoot, latestId) {
    return {
      tree: Tree.create({ root: treeRoot, latestId }),
      focusedNode: undefined,
      selectedNodes: [],
      expandedNodes: [],
      hoveredNode: undefined,

      getAncestors(node) {
        const result = [];

        while (node) {
          result.push(node);
          node = node.parent;
        }

        return result;
      },

      setSelectedNode(node) {
        this.selectedNodes = [node.id];

        this.expandedNodes = this.getAncestors(node).map((n) => n.id);
      },
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
