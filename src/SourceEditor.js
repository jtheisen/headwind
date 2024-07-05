import { Editor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StateContext } from "./state";
import { sampleDocs } from "./sampleDocuments";

export const SourceEditor = observer(function SourceEditor() {
  const state = useContext(StateContext);

  const dummy = state.doc.updateCount;

  const content = state.docHtmlRef?.innerHTML ?? "";

  return <Editor defaultLanguage="html" value={content} />;
});
