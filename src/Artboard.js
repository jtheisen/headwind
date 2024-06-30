import { observer } from "mobx-react-lite";
import { StateContext, useEditorState } from "./state";
import { createElement, useContext } from "react";
import clsx from "clsx";
import { logValueTemporarily } from "./utils";
import { ErrorBoundary } from "react-error-boundary";
import { action } from "mobx";

const ArtboardNode = observer(function ({ node }) {
  const state = useContext(StateContext);

  const doc = state.document;

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      const isSelected = doc.selectedNodes.indexOf(node.id) >= 0;

      const hasChildren = node.children && node.children.length > 0;

      const elementProps = {
        ...node.attributes.toJSON(),
        key: node.id,
        className: node.classes.map((c) => c.cls).join(" "),
        style:
          isSelected || doc.hoveredNode === node.id
            ? { background: "red" }
            : undefined,

        onMouseOver: action((e) => {
          console.info("over");
          e.stopPropagation();
          doc.hoveredNode = node.id;
        }),

        onMouseLeave: action((e) => {
          if (doc.hoveredNode === node.id) {
            doc.hoveredNode = undefined;
          }
        }),

        onClick: action((e) => {
          e.stopPropagation();
          doc.setSelectedNode(node);
        }),
      };

      const children = hasChildren
        ? node.children.map((n) => <ArtboardNode key={n.id} node={n} />)
        : undefined;

      return createElement(node.tagName, elementProps, children);
    case Node.TEXT_NODE:
      return node.textContent;
    default:
      return `?${node.nodeType}?`;
  }
});

export const Artboard = observer(function () {
  const state = useContext(StateContext);

  const root = state.document.tree.root;

  return (
    <ErrorBoundary>
      {root.children.map((n) => (
        <ArtboardNode key={n.id} node={n} />
      ))}
    </ErrorBoundary>
  );
});
