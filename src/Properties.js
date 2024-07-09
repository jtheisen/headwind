import { useContext } from "react";
import { StateContext } from "./state";
import { observer } from "mobx-react-lite";
import {
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  SegmentedControl,
} from "@blueprintjs/core";

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

function getSegmentedControlOptions(values) {
  return values.map((v) => ({ label: v, value: v }));
}

function SampleProps({}) {
  return (
    <>
      <FormGroup label="break">
        <SegmentedControl
          options={getSegmentedControlOptions([
            "normal",
            "words",
            "all",
            "keep",
          ])}
        />
      </FormGroup>
      <ButtonGroup>
        <Button icon={<i className="fas fa-" />} />
      </ButtonGroup>
    </>
  );
}

export const Properties = observer(function Properties() {
  const state = useContext(StateContext);

  return (
    <div className="flex flex-col gap-4">
      <ClassList />
      <SampleProps />
    </div>
  );
});
