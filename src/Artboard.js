import { observer } from "mobx-react-lite";
import { StateContext, useEditorState } from "./state";
import { createElement, useContext } from "react";
import clsx from "clsx";
import { logValueTemporarily } from "./utils";

const ArboardNode = observer(function ({ node }) {
  const state = useContext(StateContext);

  const doc = state.document;

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      const copy = [...doc.selectedNodes];

      const isSelected = doc.selectedNodes.indexOf(node.id) >= 0;

      const elementProps = {
        style: isSelected ? { background: "red" } : undefined,
      };
      return createElement(
        node.tagName,
        elementProps,
        node.children.map((n) => <ArboardNode key={n.id} node={n} />)
      );
    case Node.TEXT_NODE:
      return node.textContent;
    default:
      return "?";
  }
});

export const Artboard = observer(function () {
  const state = useContext(StateContext);

  return <ArboardNode node={state.document.tree.root} />;
});
