const spacingDimensions = ["x", "y", "t", "b", "l", "r", "s", "e"];

function getSpacingVariants(name, dimensions) {
  return dimensions.map((d) => `${name}${d}`);
}

const pseudoPlugins = {
  _borderStyle: ["solid", "dashed", "dotted", "double", "hidden", "none"],
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
