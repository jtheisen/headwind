/* eslint-disable no-restricted-globals */

import { action, runInAction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { createContext, useEffect, useMemo } from "react";
import { createTailwind } from "./tailwind";
import { makeDocumentStateFromNode, makeTreeFromNode } from "./tree-state2";
import { logValueTemporarily } from "./utils";

function useEvent(name, handler) {
  useEffect(() => {
    addEventListener(name, handler);
    return () => removeEventListener(name, handler);
  }, []);
}

function makeClassItem(plugin, ns, value, cls) {
  return { plugin, ns, value, cls };
}

function findClassItem(classItems, ns, plugin) {
  if (!ns) return -1;
  return classItems.findIndex((i) => i.ns === ns && i.plugin === plugin);
}

export const StateContext = createContext();

const initialDoc = `
<main>
  <div>
    foo
  </div>
  <div>
    bar
  </div>
</main>
`;

const parser = new DOMParser();

const parsedInitialDoc = parser.parseFromString(initialDoc, "text/xml");
window.parsedInitialDoc = parsedInitialDoc;

//const tree = logValueTemporarily(makeTreeFromNode(parsedInitialDoc), "tree");

export function useEditorState() {
  const tw = useMemo(createTailwind);

  const state = useLocalObservable(() => ({
    characters: [],
    classItems: [],
    preferredPluginForNs: {},
    document: makeDocumentStateFromNode(parsedInitialDoc),

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
      return c.slice(cas.length);
    },
    get currentPlugins() {
      const ns = state.candidateNs;

      if (!ns) return;

      const plugins = tw.getPluginsForNamespace(ns);

      return plugins;
    },
    get currentPlugin() {
      const plugins = this.currentPlugins;

      if (!plugins) return;

      let plugin = this.preferredPluginForNs[this.candidateNs];

      if (!plugin || !plugins.includes(plugin)) {
        plugin = plugins[0];
      }

      return plugin;
    },
    set currentPlugin(v) {
      this.preferredPluginForNs[this.candidateNs] = v;
    },
    get value() {
      const i = findClassItem(
        this.classItems,
        this.candidateNs,
        this.currentPlugin
      );
      return i < 0 ? undefined : this.classItems[i].value;
    },
    set value(v) {
      const ns = this.candidateNs;
      if (!ns) return undefined;
      const i = findClassItem(this.classItems, ns, this.currentPlugin);
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
    let plugin = state.currentPlugin;

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
