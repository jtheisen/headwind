import { observer, useLocalObservable } from "mobx-react-lite";
import { StateContext, useEditorState } from "./state";
import {
  createElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import clsx from "clsx";
import { logValueTemporarily } from "./utils";
import { ErrorBoundary } from "react-error-boundary";
import { action } from "mobx";
import useResizeObserver from "@react-hook/resize-observer";

const ArtboardNode = observer(function ({ node, registerElement }) {
  const state = useContext(StateContext);

  const doc = state.doc;

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      const isSelected = doc.selectedNodes.indexOf(node.id) >= 0;

      const hasChildren = node.children && node.children.length > 0;

      const elementProps = {
        ...node.attributes.toJSON(),
        key: node.id,
        ref: (r) => registerElement(node.id, r),
        className: node.classes.map((c) => c.cls).join(" "),
        style: isSelected ? { background: "red" } : undefined,

        onMouseOver: action((e) => {
          e.stopPropagation();
          doc.hoveredNode = node.id;
        }),

        onMouseLeave: action((e) => {
          if (doc.hoveredNode === node.id) {
            doc.hoveredNode = undefined;
          }
        }),

        onClick: action((e) => {
          e.stopPropagation();
          doc.setSelectedNode(node);
        }),
      };

      const children = hasChildren
        ? node.children.map((n) => (
            <ArtboardNode
              key={n.id}
              node={n}
              registerElement={registerElement}
            />
          ))
        : undefined;

      return createElement(node.tagName, elementProps, children);
    case Node.TEXT_NODE:
      return node.textContent;
    default:
      return `?${node.nodeType}?`;
  }
});

function OverlayNode({ refs, node, rootBcr }) {
  const element = refs[node.id];

  return (
    <section>
      {element &&
        [...element.getClientRects()].map((r, i) => {
          const { top, left, width, height } = r;
          const { x, y } = rootBcr;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: left - x,
                top: top - y,
                width,
                height,
              }}
            />
          );
        })}
      <>
        {node.children &&
          node.children.map((n) => (
            <OverlayNode key={n.id} {...{ refs, rootBcr }} node={n} />
          ))}
      </>
    </section>
  );
}

const ArtboardInteractionOverlay = observer(function ({
  doc,
  refs,
  selectionOverlayState,
  hideOverlay,
}) {
  const ref = useRef();

  const rootBcr = ref.current?.getBoundingClientRect();

  return (
    <div
      ref={ref}
      name="overlay"
      key="overlay"
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
      }}
    >
      {selectionOverlayState.renderCount && (
        <div
          style={{
            pointerEvents: !hideOverlay ? "all" : undefined,
            width: "100%",
            height: "100%",
            display: hideOverlay ? "none" : undefined,
          }}
        >
          <OverlayNode {...{ refs, rootBcr }} node={doc.tree.root} />
        </div>
      )}
    </div>
  );
});

let refCount = 0;

export const Artboard = observer(function Artboard() {
  const state = useContext(StateContext);

  const hideOverlay = state.characters.length === 0;

  const refs = useMemo(() => ({ count: ++refCount }), []);

  const selectionOverlayState = useLocalObservable(() => ({ renderCount: 0 }));

  const rerenderOverlay = action(() => {
    ++selectionOverlayState.renderCount;
    return () => {};
  });

  const resizeObserver = useMemo(() => new ResizeObserver(rerenderOverlay), []);

  const registerElement = useCallback((id, element) => {
    if (element) {
      resizeObserver.observe(element);
      refs[id] = element;
    } else {
      resizeObserver.unobserve(refs[id]);
      delete refs[id];
    }
  }, []);

  const doc = state.doc;

  const tree = doc.tree;

  const root = tree.root;

  return (
    <ErrorBoundary>
      <div style={{ position: "relative" }}>
        <div name="root-nodes" key="root-nodes">
          {root.children.map((n) => (
            <ArtboardNode
              key={n.id}
              node={n}
              registerElement={registerElement}
            />
          ))}
        </div>
        <ArtboardInteractionOverlay
          doc={doc}
          refs={refs}
          selectionOverlayState={selectionOverlayState}
          hideOverlay={hideOverlay}
        />
      </div>
    </ErrorBoundary>
  );
});
