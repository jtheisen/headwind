const spacingDimensions = ["x", "y", "t", "b", "l", "r", "s", "e"];

function getSpacingVariants(name, dimensions) {
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
};

export const pluginNamespaces = {
  margin: ["m", ...getSpacingVariants("m", spacingDimensions)],

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

  backgroundColor: ["bg"],
  borderSpacing: [...getSpacingVariants("border-spacing", ["", "x", "y"])],
};
