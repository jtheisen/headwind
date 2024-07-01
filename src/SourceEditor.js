import { Editor } from "@monaco-editor/react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StateContext } from "./state";
import { tailwindPlaygroundSampleHtml } from "./sampleDocuments";

export const SourceEditor = observer(function () {
  const state = useContext(StateContext);

  return (
    <Editor
      defaultLanguage="html"
      defaultValue={tailwindPlaygroundSampleHtml}
    />
  );
});
