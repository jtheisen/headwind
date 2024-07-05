/* eslint-disable no-restricted-globals */

import { action, runInAction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { createContext, useEffect, useMemo } from "react";
import { createTailwind } from "./tailwind";
import { createDocumentFactory } from "./tree-state";
import { logValueTemporarily, parseDocument } from "./utils";
import { sampleDocs } from "./sampleDocuments";

function useEvent(name, handler) {
  useEffect(() => {
    addEventListener(name, handler);
    return () => removeEventListener(name, handler);
  }, []);
}

function findClassItem(classItems, ns, plugin) {
  if (!ns) return -1;
  return classItems.findIndex((i) => i.ns === ns && i.plugin === plugin);
}

export const StateContext = createContext();

export function useEditorState(path) {
  const tw = useMemo(createTailwind);

  const state = useLocalObservable(() => {
    const sampleDocHtml = sampleDocs[path] ?? sampleDocs.tailwind;

    const parsedInitialDoc = parseDocument(sampleDocHtml);

    const documentFactory = createDocumentFactory(tw.getClassModelForClass);

    const initialStateDocument =
      documentFactory.makeDocumentStateFromNode(parsedInitialDoc);

    return {
      characters: [],
      preferredPluginForNs: {},
      doc: initialStateDocument,
      docHtmlRef: undefined,

      get firstSelectedNode() {
        const doc = this.doc;
        if (!doc.selectedNodes) return undefined;
        const firstId = doc.selectedNodes[0];
        if (!firstId) return undefined;
        const first = doc.tree.findById(firstId);
        return first;
      },
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
        if (!this.firstSelectedNode) return undefined;
        const classes = this.firstSelectedNode.classes;
        const i = findClassItem(classes, this.candidateNs, this.currentPlugin);
        logValueTemporarily(classes[i], "cls");
        return i < 0 ? undefined : classes[i].value;
      },
      set value(v) {
        const ns = this.candidateNs;
        if (!ns || !this.firstSelectedNode) return undefined;
        const i = findClassItem(
          this.firstSelectedNode.classes,
          ns,
          this.currentPlugin
        );
        if (i < 0) {
          if (!v) return;
          const cls = tw.getClassName(ns, v);
          const plugin = tw.getPluginForClass(cls);
          this.firstSelectedNode.addTailwindClass({ plugin, ns, cls });
        } else {
          const ci = this.firstSelectedNode.classes[i];
          if (v) {
            ci.setClass(tw.getClassName(ns, v));
          } else {
            this.firstSelectedNode.removeClass(ci);
          }
        }
      },
    };
  });

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

    const values = [undefined, ...Object.keys(pluginValuesObject)];

    const i = values.indexOf(state.value);

    const sign = Math.sign(e.deltaY);

    const newI = (sign + i + values.length) % values.length;

    const newValue = values[newI];

    runInAction(() => (state.value = newValue));
  });

  return state;
}
