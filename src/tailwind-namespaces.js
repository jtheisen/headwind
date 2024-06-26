const spacingDimensions = ["x", "y", "t", "b", "l", "r", "s", "e"];

function getVariantNames(name, dimensions) {
  return dimensions.map((d) => `${name}${d}`);
}

function makePluginObject(list) {
  return Object.fromEntries(list.map((i) => [i, "DUMMY"]));
}

export const pseudoPlugins = {
  _borderStyle: makePluginObject([
    "solid",
    "dashed",
    "dotted",
    "double",
    "hidden",
    "none",
  ]),
  _outlineStyle: makePluginObject([
    "none",
    "DEFAULT",
    "dashed",
    "dotted",
    "double",
  ]),
  _backgroundAttachment: makePluginObject(["fixed", "local", "scroll"]),
  _backgroundClip: makePluginObject(["border", "padding", "content", "text"]),
  _backgroundOrigin: makePluginObject(["border", "padding", "content"]),
  _backgroundPosition: makePluginObject([
    "center",
    "bottom",
    "left",
    "left-bottom",
    "left-top",
    "right",
    "right-bottom",
    "right-top",
    "top",
  ]),
  _backgroundRepeat: makePluginObject([
    "repeat",
    "no-repeat",
    "repeat-x",
    "repeat-y",
    "repeat-round",
    "repeat-space",
  ]),
  _backgroundSize: makePluginObject(["auto", "cover", "contain"]),
  _backgroundGradient: makePluginObject([
    "none",
    "gradient-to-t",
    "gradient-to-tr",
    "gradient-to-r",
    "gradient-to-br",
    "gradient-to-b",
    "gradient-to-bl",
    "gradient-to-l",
    "gradient-to-tl",
  ]),
};

export const pluginNamespaces = {
  margin: ["m", ...getVariantNames("m", spacingDimensions)],

  borderWidth: ["border"],
  borderRadius: ["rounded"],
  borderColor: ["border"],
  borderOpacity: ["border-opacity"],
  _borderStyle: ["border"],

  outlineWidth: ["outline"],
  _outlineStyle: ["outline"],
  outlineOffset: ["outline-offset"],

  ringWidth: ["ring"],
  ringColor: ["ring"],
  ringOpacity: ["ring-opacity"],
  ringOffsetWidth: ["ring-offset"],
  ringOffsetColor: ["ring-offset"],

  _backgroundAttachment: ["bg"],
  _backgroundClip: ["bg"],
  backgroundColor: ["bg"],
  backgroundOpacity: ["bg-opacity"],
  _backgroundOrigin: ["bg-origin"],
  _backgroundPosition: ["bg"],
  _backgroundRepeat: ["bg"],
  _backgroundGradient: ["bg"],

  gradientColorStops: ["from", "via", "to"],
  gradientColorStopPositions: ["from", "via", "to"],

  borderSpacing: [...getVariantNames("border-spacing", ["", "x", "y"])],
};
