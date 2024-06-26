/* eslint-disable no-restricted-globals */

import { Button, ButtonGroup } from "@blueprintjs/core";
import { Download } from "@blueprintjs/icons";
import { makeObservable, action, runInAction } from "mobx";
import { useLocalObservable, observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { createTailwind } from "./tailwind";

function useEvent(name, handler) {
  useEffect(() => {
    addEventListener(name, handler);
    return () => removeEventListener(name, handler);
  }, []);
}

function makeClassItem(plugin, ns, value, cls) {
  return { plugin, ns, value, cls };
}

function findClassItem(classItems, ns) {
  if (!ns) return -1;
  return classItems.findIndex((i) => i.ns === ns);
}

function useEditorState() {
  const tw = useMemo(createTailwind);

  const state = useLocalObservable(() => ({
    characters: [],
    classItems: [],

    get charactersAsString() {
      return this.characters.join("");
    },
    get candidateNs() {
      return tw.getCandidateNamespace(this.charactersAsString);
    },
    get suffixToCandidateNs() {
      const c = this.candidateNs;
      if (!c) return undefined;
      const cas = this.charactersAsString;
      console.info(cas);
      return c.slice(cas.length);
    },

    get value() {
      const i = findClassItem(this.classItems, this.candidateNs);
      return i < 0 ? undefined : this.classItems[i].value;
    },
    set value(v) {
      const ns = this.candidateNs;
      if (!ns) return undefined;
      const i = findClassItem(this.classItems, ns);
      if (i < 0) {
        const cls = tw.getClassName(ns, v);
        const plugin = tw.getPluginForClass(cls);
        runInAction(() => this.classItems.push({ plugin, ns, value: v, cls }));
      } else {
        const ci = this.classItems[i];
        runInAction(() => {
          ci.value = v;
          ci.cls = tw.getClassName(ns, v);
        });
      }
    },
  }));

  useEvent("keydown", function (e) {
    //console.info("key: ", e.key);
    if (e.key === "q" || e.key === "Backspace") {
      if (state.characters.length > 0) {
        action(() => state.characters.pop())();
      }
    } else if (e.key.length > 1) {
      return;
    } else {
      action(() => state.characters.push(e.key))();
    }
  });

  useEvent("wheel", function (e) {
    const ns = state.candidateNs;

    if (!ns) return;

    const plugins = tw.getPluginsForNamespace(ns);

    if (!plugins) return;

    const plugin = plugins[0];

    if (!plugin) return;

    const pluginValuesObject = tw.getValuesForPlugin(plugin);

    if (typeof pluginValuesObject !== "object") {
      console.error(`Could not get config object for plugin ${plugin}`);
      return;
    }

    const values = Object.keys(pluginValuesObject);

    const i = values.indexOf(state.value);

    const sign = Math.sign(e.deltaY);

    const newI = (sign + i + values.length) % values.length;

    const newValue = values[newI];

    runInAction(() => (state.value = newValue));
  });

  return state;
}

const App = observer(function () {
  const [dummy, setDummy] = useState(0);

  const state = useEditorState();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div>
        <KeyView state={state} />
      </div>
      <div style={{ flexGrow: 1, display: "grid", placeItems: "center" }}>
        <div
          className={state.classItems.map((i) => i.cls).join(" ")}
          style={{ width: "10rem", height: "10rem", background: "beige" }}
        >
          {state.value}
        </div>
      </div>
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
    </div>
  );
});

export default App;

const KeyView = observer(function ({ state }) {
  return (
    <div>
      <span className="font-bold">{state.charactersAsString}</span>
      <span className="font-bold opacity-50">{state.suffixToCandidateNs}</span>
    </div>
  );
});
