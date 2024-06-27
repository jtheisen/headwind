const spacingDimensions = ["", "x", "y", "t", "b", "l", "r", "s", "e"];

const roundingDimensions = [
  "",
  "t",
  "tr",
  "r",
  "br",
  "b",
  "bl",
  "l",
  "tl",
  "s",
  "e",
  "s",
  "e",
  "ss",
  "se",
  "es",
  "ee",
];

const baseAlignments = ["start", "end", "center", "stretch"];

const baseBlendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

function getVariantNames(name, dimensions) {
  return dimensions.map((d) => `${name}${d}`);
}

function makePluginObject(list) {
  return Object.fromEntries(list.map((i) => [i, "DUMMY"]));
}

const pseudoPluginDefinitions = {
  _borderStyle: ["solid", "dashed", "dotted", "double", "hidden", "none"],
  _outlineStyle: ["none", "DEFAULT", "dashed", "dotted", "double"],
  _backgroundAttachment: ["fixed", "local", "scroll"],
  _backgroundClip: ["border", "padding", "content", "text"],
  _backgroundOrigin: ["border", "padding", "content"],
  _backgroundRepeat: [
    "repeat",
    "no-repeat",
    "repeat-x",
    "repeat-y",
    "repeat-round",
    "repeat-space",
  ],
  _backgroundSize: ["auto", "cover", "contain"],

  // Layout
  _container: ["DEFAULT"],
  _break: [
    "auto",
    "avoid",
    "all",
    "avoid-page",
    "page",
    "left",
    "right",
    "column",
  ],
  _boxDecorationBreak: ["clone", "slice"],
  _boxSizing: ["border", "content"],
  _display: [
    "block",
    "inline-block",
    "inline",
    "flex",
    "inline-flex",
    "table",
    "inline-table",
    "table-caption",
    "table-cell",
    "table-column",
    "table-column-group",
    "table-footer-group",
    "table-header-group",
    "table-row-group",
    "table-row",
    "flow-root",
    "grid",
    "inline-grid",
    "contents",
    "list-item",
    "hidden",
  ],
  _float: ["start", "end", "right", "left", "none"],
  _clear: ["start", "end", "right", "left", "both", "none"],
  _isolation: ["DEFAULT", "auto"],
  _objectFit: ["contain", "cover", "fill", "none", "scale-down"],
  _overflow: ["auto", "hidden", "clip", "visible", "scroll"],
  _overscroll: ["auto", "contain", "none"],
  _position: ["static", "fixed", "absolute", "relative", "sticky"],
  _visibility: ["visible", "hidden", "collapse"],
  _spaceReverse: ["reverse"],

  // Flex and Grid

  _flexDirection: ["row", "row-reverse", "col", "col-reverse"],
  _flexWrap: ["wrap", "wrap-reverse", "nowrap"],
  _justifyContent: [...baseAlignments, "normal", "between", "around", "evenly"],
  _justifyItems: [...baseAlignments],
  _justifySelf: [...baseAlignments, "auto"],
  _alignContent: [
    ...baseAlignments,
    "normal",
    "between",
    "around",
    "evenly",
    "baseline",
  ],
  _alignItems: [...baseAlignments, "baseline"],
  _alignSelf: [...baseAlignments, "baseline", "auto"],
  _placeContent: [...baseAlignments, "between", "around", "evenly", "baseline"],
  _placeItems: [...baseAlignments, "baseline"],
  _placeSelf: [...baseAlignments, "auto"],

  _gridAutoFlow: ["row", "col", "dense", "row-dense", "col-dense"],

  // Typography

  _fontSmoothing: ["antialiased", "subpixel-antialiased"],
  _fontStyle: ["italic", "non-italic"],
  _fontVariantNumeric: [
    "normal-nums",
    "ordinal",
    "slashed-zero",
    "lining-nums",
    "oldstyle-nums",
    "proportional-nums",
    "tabular-nums",
    "diagonal-fractions",
    "stacked-fractions",
  ],
  _listImage: ["none"],
  _listPosition: ["inside", "outside"],
  _listStyle: ["none", "disc", "decimal"],
  _textAlign: ["left", "center", "right", "justify", "start", "end"],
  _textDecoration: ["underline", "overline", "line-through", "no-underline"],
  _textDecorationStyle: ["solid", "double", "dotted", "dashed", "wavy"],
  _textTransform: ["uppercase", "lowercase", "capitalize", "normal-case"],
  _textOverflow: ["truncate", "text-ellipsis", "text-clip"],
  _textWrap: ["wrap", "nowrap", "balance", "pretty"],
  _verticalAlign: [
    "baseline",
    "top",
    "middle",
    "bottom",
    "text-top",
    "text-bottom",
    "sub",
    "super",
  ],
  _whitespace: [
    "normal",
    "nowrap",
    "pre",
    "pre-line",
    "pre-wrap",
    "break-spaces",
  ],
  _workBreak: ["normal", "words", "all", "keep"],
  _hyphens: ["none", "manual", "auto"],
  _content: ["none"],

  // Effects

  _mixBlendMode: [...baseBlendModes, "plus-darker", "plus-lighter"],
  _backgroundBlendMode: baseBlendModes,

  // Tables

  _borderCollapse: ["collapse", "separate"],
  _tableLayout: ["auto", "fixed"],
  _captionSide: ["top", "bottom"],

  // Interactivity

  _appearance: ["none", "auto"],
  _pointerEvents: ["none", "auto"],
  _resize: ["DEFAULT", "x", "y", "none"],
  _scrollBehavior: ["auto", "smooth"],
  _scrollSnapAlign: ["start", "end", "center", "align-none"],
  _scrollSnapStop: ["normal", "always"],
  _scrollSnapDirection: ["none", "x", "y", "both"],
  _scrollSnapType: ["mandatory", "proximity"],
  _touchAction: [
    "auto",
    "none",
    "pan-x",
    "pan-left",
    "pan-right",
    "pan-y",
    "pan-up",
    "pan-down",
    "pinch-zoom",
    "manipulation",
  ],
  _userSelect: ["none", "text", "all", "auto"],
  _willChange: ["auto", "scroll", "contents", "transform"],

  // Accessibility

  _screenReaders: ["sr-only", "not-sr-only"],
  _forcedColorAdjust: ["auto", "none"],
};

export const pseudoPlugins = Object.fromEntries(
  Object.keys(pseudoPluginDefinitions).map((k) => [
    k,
    makePluginObject(pseudoPluginDefinitions[k]),
  ])
);

export const pluginNamespaces = {
  // Layout

  aspectRatio: ["aspect"],
  _container: ["container"], // container (config is special and it's only there or not)
  columns: ["columns"],
  _break: ["break-after", "break-before", "break-inside"],
  _boxDecorationBreak: ["box-decoration"],
  _boxSizing: ["box"],
  _display: [""], // issue
  _float: ["float"],
  _clear: ["clear"],
  _isolation: ["isolation"],
  _objectFit: ["object"],
  objectPosition: ["object"],
  _overflow: ["overflow", "overflow-x", "overflow-y"],
  _overscroll: ["overscroll", "overscroll-x", "overscroll-y"],
  _position: [""], // issue
  _visibility: [""], //issue
  zIndex: ["z"],
  spacing: ["inset", "start", "end", "top", "right", "bottom", "left"],

  // Flex and Grid

  flexBasis: ["basis"],
  flexGrow: ["grow"],
  flexShrink: ["shrink"],
  _flexDirection: ["flex"],
  _flexWrap: ["flex"],
  flex: ["flex"],

  order: ["order"],
  gap: ["gap"],

  gridTemplateColumns: ["grid-cols"],
  gridTemplateRows: ["grid-rows"],
  gridColumn: ["col"],
  gridColumnStart: ["col-start"],
  gridColumnEnd: ["col-end"],
  gridRow: ["row"],
  gridRowStart: ["row-start"],
  gridRowEnd: ["row-end"],
  _gridAutoFlow: ["grid-flow"],
  gridAutoColumns: ["auto-cols"],
  gridAutoRows: ["auto-rows"],

  _justifyContent: ["justify"],
  _justifyItems: ["justify-items"],
  _justifySelf: ["justify-self"],
  _alignContent: ["content"],
  _alignItems: ["items"],
  _alignSelf: ["self"],
  _placeContent: ["place-content"],
  _placeItems: ["place-items"],
  _placeSelf: ["place-self"],

  // Spacing

  padding: [...getVariantNames("p", spacingDimensions)],
  margin: [...getVariantNames("m", spacingDimensions)],
  space: ["space-x", "space-y"],
  _spaceReverse: ["space-x", "space-y"],

  // Sizing

  width: ["w"],
  maxWidth: ["max-w"],
  minWidth: ["min-w"],
  height: ["h"],
  maxHeight: ["max-h"],
  minHeight: ["min-h"],
  size: ["size"],

  // Typography

  fontFamily: ["font"],
  fontSize: ["text"],
  _fontSmoothing: [""], // issue
  _fontStyle: [""], // issue
  fontWeight: ["font"],
  _fontVariantNumeric: [""], //issue
  letterSpacing: ["tracking"],
  lineClamp: ["line-clamp"],
  lineHeight: ["leading"],
  _listImage: ["list-image"],
  _listPosition: ["list"],
  _listStyle: ["list"],
  _textAlign: ["text"],
  textColor: ["text"],
  _textDecoration: [""], // issue
  textDecorationColor: ["decoration"],
  _textDecorationStyle: ["decoration"],
  textDecorationThickness: ["decoration"],
  textUnderlineOffset: ["underline-offset"],
  _textTransform: [""], // issue
  _textOverflow: [""], // issue
  _textWrap: ["text"],
  textIndent: ["text"],
  _verticalAlign: ["align"],
  _whitespace: ["whitespace"],
  _workBreak: ["break"],
  _hyphens: ["hyphens"],
  _content: ["content"],

  // Backgrounds

  _backgroundAttachment: ["bg"],
  _backgroundClip: ["bg"],
  backgroundColor: ["bg"],
  backgroundOpacity: ["bg-opacity"],
  _backgroundOrigin: ["bg-origin"],
  backgroundPosition: ["bg"],
  _backgroundRepeat: ["bg"],
  backgroundImage: ["bg"],

  gradientColorStops: ["from", "via", "to"],
  gradientColorStopPositions: ["from", "via", "to"],

  // Borders

  borderWidth: [...getVariantNames("border", spacingDimensions)],
  borderRadius: [...getVariantNames("rounded", roundingDimensions)],
  borderColor: ["border"],
  borderOpacity: ["border-opacity"],
  _borderStyle: ["border"],

  divideWidth: ["divide-x", "divide-y"], // FIXME: reverse
  divideColor: ["divide"],
  divideOpacity: ["divide"], // strangely not in doc

  outlineWidth: ["outline"],
  _outlineStyle: ["outline"],
  outlineOffset: ["outline-offset"],

  ringWidth: ["ring"],
  ringColor: ["ring"],
  ringOpacity: ["ring-opacity"],
  ringOffsetWidth: ["ring-offset"],
  ringOffsetColor: ["ring-offset"],

  // Effects

  boxShadow: ["shadow"],
  boxShadowColor: ["shadow"],
  opacity: ["opacity"],
  _mixBlendMode: ["mix-blend"],
  _backgroundBlendMode: ["bg-blend"],

  // Filter

  blur: ["blur"],
  brightness: ["brightness"],
  contrast: ["contrast"],
  dropShadow: ["drop-shadow"],
  grayscale: ["grayscale"],
  hueRotate: ["hue-rotate"],
  invert: ["invert"],
  saturate: ["saturate"],
  sepia: ["sepia"],

  backdropBlur: ["backdrop-blur"],
  backdropBrightness: ["backdrop-brightness"],
  backdropContrast: ["backdrop-contrast"],
  backdropDropShadow: ["drop-backdrop-shadow"],
  backdropGrayscale: ["backdrop-grayscale"],
  backdropHueRotate: ["hue-backdrop-rotate"],
  backdropInvert: ["backdrop-invert"],
  backdropSaturate: ["backdrop-saturate"],
  backdropSepia: ["backdrop-sepia"],

  // Tables

  _borderCollapse: ["border"],
  borderSpacing: getVariantNames("border-spacing", ["", "-x", "-y"]),
  _tableLayout: ["table"],
  _captionSide: ["caption"],

  // Transitions

  transitionProperty: ["transition"],
  transitionDuration: ["duration"],
  transitionTimingFunction: ["ease"],
  transitionDelay: ["delay"],
  animation: ["animation"],

  // Transforms

  scale: getVariantNames("scale", ["", "-x", "-y"]),
  rotate: ["rotate"],
  translate: getVariantNames("scale", ["-x", "-y"]),
  skew: getVariantNames("scale", ["-x", "-y"]),
  transformOrigin: ["origin"],

  // Interactivity

  accentColor: ["accent"],
  _appearance: ["appearance"],
  cursor: ["cursor"],
  caretColor: ["caret"],
  _pointerEvents: ["pointer-events"],
  _resize: ["resize"],
  _scrollBehavior: ["scroll"],
  scrollMargin: getVariantNames("scroll-m", spacingDimensions),
  scrollPadding: getVariantNames("scroll-p", spacingDimensions),
  _scrollSnapAlign: ["snap"],
  _scrollSnapStop: ["snap"],
  _scrollSnapDirection: ["snap"],
  _scrollSnapType: ["snap"],
  _touchAction: ["touch"],
  _userSelect: ["select"],
  _willChange: ["will-change"],

  // SVG

  fill: ["fill"],
  stroke: ["stroke"],
  strokeWidth: ["stroke"],

  // Accessibility

  _screenReaders: [""], // issue
  _forcedColorAdjust: ["forced-color-adjust"],
};
