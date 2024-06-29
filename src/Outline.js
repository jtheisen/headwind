import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { ControlledTreeEnvironment, Tree } from "react-complex-tree";
import { StateContext } from "./state";
import { renderers as bpRenderers } from "react-complex-tree-blueprintjs-renderers";
import { observable } from "mobx";
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

export function getItemsForTreeControl(root) {
  const result = {};

  function collect(node) {
    result[node.id] = {
      index: node.id,
      children: node.children ? node.children.map((c) => c.id) : undefined,
      data: node,
      isFolder: !!node.children,
    };
    if (node.children) {
      for (const n of node.children) {
        collect(n);
      }
    }
  }

  collect(root);

  return result;
}

console.info(bpRenderers);

export const Outline = observer(function () {
  const state = useContext(StateContext);

  const [focusedItem, setFocusedItem] = useState();
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  let items = getItemsForTreeControl(state.tree);

  let rootId = Object.keys(items)[0];

  //logValueTemporarily(JSON.stringify(items), "items");

  return (
    <div>
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={(i) => i.data.tagName}
        viewState={{
          "tree-1": {
            focusedItem,
            expandedItems,
            selectedItems,
          },
        }}
        onFocusItem={(item) => setFocusedItem(item.index)}
        onExpandItem={(item) =>
          setExpandedItems([...expandedItems, item.index])
        }
        onCollapseItem={(item) =>
          setExpandedItems(
            expandedItems.filter(
              (expandedItemIndex) => expandedItemIndex !== item.index
            )
          )
        }
        onSelectItems={(items) => setSelectedItems(items)}
        {...renderers}
      >
        <Tree treeId="tree-1" rootItem={rootId} treeLabel="Tree Example" />
      </ControlledTreeEnvironment>
    </div>
  );
});
