import { camelCase } from "lodash";

export const htmlToReactAttributes = {
  // HTML attributes
  "accept-charset": "acceptCharset",
  class: "className",
  for: "htmlFor",
  "http-equiv": "httpEquiv",

  // SVG attributes
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "xlink:actuate": "xlinkActuate",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:href": "xlinkHref",
  "xlink:role": "xlinkRole",
  "xlink:show": "xlinkShow",
  "xlink:title": "xlinkTitle",
  "xlink:type": "xlinkType",
  "xmlns:xlink": "xmlnsXlink",
  "xml:base": "xmlBase",
  "xml:lang": "xmlLang",
  "xml:space": "xmlSpace",
};

export function convertAttributeNameFromDomToReact(name) {
  return htmlToReactAttributes[name] ?? name;
}

export function convertStyleNameFromDomToReact(name) {
  return camelCase(name);
}
