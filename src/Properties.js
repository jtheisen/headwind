import { useContext } from "react";
import { StateContext } from "./state";
import { observer } from "mobx-react-lite";

const ClassItem = observer(function ({ classItem }) {
  if (classItem.tailwind) {
    return (
      <div className="class-tag class-tag-tailwind">
        <span className="class-tag-ns">{classItem.ns}</span>-
        <span className="class-tag-value">{classItem.value}</span>
      </div>
    );
  } else {
    return <div className="class-tag class-tag-notailwind">{classItem.ns}</div>;
  }
});

const ClassList = observer(function () {
  const { firstSelectedNode } = useContext(StateContext);

  if (!firstSelectedNode) return false;

  return (
    <div className="class-tag-list">
      {firstSelectedNode.classes.map((c) => (
        <ClassItem key={c.cls} classItem={c} />
      ))}
    </div>
  );
});

export const Properties = observer(function () {
  const state = useContext(StateContext);

  return (
    <div>
      <ClassList />
    </div>
  );
});
