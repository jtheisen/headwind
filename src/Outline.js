import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import {
  ControlledTreeEnvironment,
  InteractionMode,
  Tree,
} from "react-complex-tree";
import { StateContext } from "./state";
import { renderers as bpRenderers } from "react-complex-tree-blueprintjs-renderers";
import { action, observable } from "mobx";
import { logValueTemporarily } from "./utils";
import { Classes } from "@blueprintjs/core";

const cx = (...classNames) => classNames.filter((cn) => !!cn).join(" ");

export const renderers = {
  ...bpRenderers,
  renderTreeContainer: (props) => (
    <div className={cx(Classes.TREE, Classes.COMPACT)}>
      <ul
        className={cx(Classes.TREE_ROOT, Classes.TREE_NODE_LIST)}
        {...props.containerProps}
      >
        {props.children}
      </ul>
    </div>
  ),
};

export function getItemsForTreeControl(root, insertDummyRoot) {
  const result = {};

  function collect(node) {
    result[node.id] = {
      index: node.id,
      children: node.children ? node.children.map((c) => c.id) : undefined,
      data: node,
      isFolder: !!node.children && node.children.length > 0,
    };
    if (node.children) {
      for (const n of node.children) {
        collect(n);
      }
    }
  }

  collect(root);

  let rootId = Object.keys(result)[0];

  if (insertDummyRoot) {
    result["root"] = {
      index: "root",
      children: [rootId],
      isFolder: true,
    };
    rootId = "root";
  }

  return [result, rootId];
}

//console.info(bpRenderers);

export const Outline = observer(function Outline() {
  const state = useContext(StateContext);

  let [items, rootId] = getItemsForTreeControl(state.doc.tree.root, false);

  const doc = state.doc;

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={(i) => i.data.label}
        defaultInteractionMode={InteractionMode.DoubleClickItemToExpand}
        viewState={{
          "tree-1": {
            focusedItem: doc.focusedNode,
            expandedItems: doc.expandedNodes,
            selectedItems: doc.selectedNodes,
          },
        }}
        onFocusItem={action((item) => (doc.focusedNode = item.index))}
        onExpandItem={action(
          (item) => (doc.expandedNodes = [...doc.expandedNodes, item.index])
        )}
        onCollapseItem={action(
          (item) =>
            (doc.expandedNodes = doc.expandedNodes.filter(
              (id) => id !== item.index
            ))
        )}
        onSelectItems={action((items) => (doc.selectedNodes = items))}
        {...renderers}
      >
        <Tree treeId="tree-1" rootItem={rootId} treeLabel="Tree Example" />
      </ControlledTreeEnvironment>
    </div>
  );
});
