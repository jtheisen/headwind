import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { ControlledTreeEnvironment, Tree } from "react-complex-tree";
import { StateContext } from "./state";
import { renderers as bpRenderers } from "react-complex-tree-blueprintjs-renderers";

export const Outline = observer(function () {
  const state = useContext(StateContext);

  const [focusedItem, setFocusedItem] = useState();
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  //const contents = useMemo(() => observable(makeBpTreeNodeInfo(state.tree)));
  const [items] = useState(
    //observable
    {
      root: {
        index: "root",
        canMove: true,
        isFolder: true,
        children: ["child1"],
        data: "Root item",
        canRename: true,
      },
      child1: {
        index: "child1",
        canMove: true,
        isFolder: true,
        children: ["child2"],
        data: "Child item",
        canRename: true,
      },
      child2: {
        index: "child2",
        canMove: true,
        isFolder: false,
        children: [],
        data: "Child item",
        canRename: true,
      },
    }
  );

  console.info(items);
  window.contents = items;

  return (
    <div>
      <ControlledTreeEnvironment
        items={items}
        getItemTitle={(i) => i.index}
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
        {...bpRenderers}
      >
        <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
      </ControlledTreeEnvironment>
    </div>
  );
});
