function stringifyAndParse(o) {
  try {
    return JSON.parse(JSON.stringify(o));
  } catch (ex) {
    return "[exception]";
  }
}

export function logValueTemporarily(value, name = "temp") {
  console.info({ [name]: value, json: stringifyAndParse(value) });
  window[name] = value;
  return value;
}

export function parseHtmlAndGetBody(html) {
  if (typeof html !== "string") throw Error("Expected a string to parse");

  const parser = new DOMParser();

  function wrapHtml5(content) {
    return `
<!DOCTYPE html>
<html>
<head></head>
<body>${content}</body>
</html>
    `;
  }

  const doc = parser.parseFromString(wrapHtml5(html), "text/html");

  const bodies = doc.getElementsByTagName("body");

  return bodies[0];
}

// export function parseHtmlAndGetBody(html) {
//   const doc = parseDocument(html);

//   return doc.getElementsByTagName("body");
// }
