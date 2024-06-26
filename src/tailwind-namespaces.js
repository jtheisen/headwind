const spacingDimensions = ["x", "y", "t", "b", "l", "r", "s", "e"];

function getSpacingVariants(name, dimensions) {
  return dimensions.map((d) => `${name}${d}`);
}

export const pseudoPlugins = {
  _borderStyle: Object.fromEntries(
    ["solid", "dashed", "dotted", "double", "hidden", "none"].map((i) => [
      i,
      "DUMMY",
    ])
  ),
};

export const pluginNamespaces = {
  margin: ["m", ...getSpacingVariants("m", spacingDimensions)],
  borderWidth: ["border"],
  borderRadius: ["rounded"],
  // borderStyle missing (hard-coded)
  _borderStyle: ["border"],
  borderColor: ["border"],
  backgroundColor: ["bg"],
  borderSpacing: [...getSpacingVariants("border-spacing", ["", "x", "y"])],
};
