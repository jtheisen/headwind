import { Editor, useMonaco } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { StateContext } from "./state";
import { sampleDocs } from "./sampleDocuments";

export const SourceEditor = observer(function SourceEditor() {
  const state = useContext(StateContext);

  const ref = useRef();

  const dummy = state.doc.updateCount;

  const content = state.docHtmlRef?.innerHTML ?? "";

  function setRef(value) {
    const editor = (window.monaco = ref.current = value);

    const subscription = editor.onDidChangeModelContent((e) => {});
  }

  return (
    <Editor
      onMount={(e) => setRef(e)}
      onUnmount={() => setRef(undefined)}
      defaultLanguage="html"
      value={content}
    />
  );
});
