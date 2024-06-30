import { observer } from "mobx-react-lite";
import { StateContext, useEditorState } from "./state";
import { createElement, useContext } from "react";
import clsx from "clsx";
import { logValueTemporarily } from "./utils";
import { ErrorBoundary } from "react-error-boundary";

const ArtboardNode = observer(function ({ node }) {
  const state = useContext(StateContext);

  const doc = state.document;

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      const isSelected = doc.selectedNodes.indexOf(node.id) >= 0;

      const hasChildren = node.children && node.children.length > 0;

      const elementProps = {
        ...node.attributes.toJSON(),
        className: node.classes.map((c) => c.cls).join(" "),
        style: isSelected ? { background: "red" } : undefined,
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

  return (
    <ErrorBoundary>
      <ArtboardNode node={state.document.tree.root} />
    </ErrorBoundary>
  );
});
