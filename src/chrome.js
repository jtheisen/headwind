import {
  Button,
  ButtonGroup,
  SegmentedControl,
  Tree,
  TreeNode,
} from "@blueprintjs/core";
import { Download } from "@blueprintjs/icons";
import { action, observable } from "mobx";
import { Observer, observer } from "mobx-react-lite";
import { useContext, useMemo, useState } from "react";
import { useEditorState, StateContext } from "./state";
import { Outline } from "./Outline";
import { Allotment } from "allotment";
import { Artboard } from "./Artboard";
import { Properties } from "./Properties";

const TestOutline = observer(function ({ node }) {
  return (
    <div>
      <div>{node.id}</div>
      {node.children.map((n) => (
        <div onClick={() => n.addChild()}>
          <TestOutline node={n} />
        </div>
      ))}
    </div>
  );
});

const App = observer(function () {
  const [dummy, setDummy] = useState(0);

  const state = (window.state = useEditorState());

  return (
    <StateContext.Provider value={state}>
      {/* <TestOutline node={sampleTree.root} /> */}
      <Allotment vertical={false}>
        <Allotment.Pane preferredSize={300} minSize={100} snap={true}>
          <Outline />
        </Allotment.Pane>
        <Allotment.Pane>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ display: "flex" }}>
              <KeyView state={state} />
              <PluginSelector state={state} />
            </div>
            <div style={{ flexGrow: 1, display: "grid", placeItems: "center" }}>
              <Artboard />
              {/* <div
                className={state.classItems.map((i) => i.cls).join(" ")}
                style={{ width: "10rem", height: "10rem" }}
              >
                {state.value}
              </div> */}
            </div>
          </div>
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} minSize={100} snap={true}>
          <Properties />
        </Allotment.Pane>
      </Allotment>
      {/* <div
        style={{ display: "flex", flexDirection: "column", height: "100dvh" }}
      >
        <ButtonGroup>
          <Button
            icon={<Download size={16} />}
            onClick={() => setDummy(dummy + 1)}
          ></Button>
          <Button icon={<Download size={16} />}></Button>
          <Button icon={<i className="fas fa-check" />}></Button>
          <Button icon={<i className="fas fa-align-left" />}></Button>
          <Button icon={<i className="fas fa-align-center" />}></Button>
          <Button icon={<i className="fas fa-align-right" />}></Button>
        </ButtonGroup>
      </div> */}
    </StateContext.Provider>
  );
});

export default App;

const PluginSelector = observer(function ({ state }) {
  const plugins = state.currentPlugins;
  if (!plugins || plugins.length === 0) return false;
  return (
    <SegmentedControl
      value={state.currentPlugin}
      onValueChange={action((v) => (state.currentPlugin = v))}
      options={plugins.map((p) => ({ label: p, value: p }))}
    />
  );
});

const KeyView = observer(function ({ state }) {
  return (
    <div>
      <span className="font-bold">{state.charactersAsString}</span>
      <span className="font-bold opacity-50">{state.suffixToCandidateNs}</span>
    </div>
  );
});
