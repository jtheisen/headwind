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
import { SourceEditor } from "./SourceEditor";

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

const Chrome = observer(function Chrome({ path }) {
  const state = (window.state = useEditorState(path));

  return (
    <StateContext.Provider value={state}>
      {/* <TestOutline node={sampleTree.root} /> */}
      <Allotment vertical={true}>
        <Allotment.Pane>
          <Allotment vertical={false}>
            <Allotment.Pane preferredSize={300} minSize={100} snap={true}>
              <Outline />
            </Allotment.Pane>
            <Allotment.Pane>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <TopBar state={state} />
                <div
                  style={{ flexGrow: 1, display: "grid", placeItems: "center" }}
                >
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
        </Allotment.Pane>
        <Allotment.Pane
          preferredSize={300}
          minSize={100}
          snap={true}
          visible={false}
        >
          <SourceEditor />
        </Allotment.Pane>
      </Allotment>
    </StateContext.Provider>
  );
});

export default Chrome;

function TopBar({ state }) {
  return (
    <div
      className="window-border"
      style={{ display: "flex", minHeight: 36, borderBottomWidth: 1 }}
    >
      &nbsp;
      <KeyView state={state} />
      <PluginSelector state={state} />
    </div>
  );
}

const PluginSelector = observer(function PluginSelector({ state }) {
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

const KeyView = observer(function KeyView({ state }) {
  return (
    <div>
      <span className="font-bold">{state.charactersAsString}</span>
      <span className="font-bold opacity-50">{state.suffixToCandidateNs}</span>
    </div>
  );
});
