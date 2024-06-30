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

export function parseDocument(html) {
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

  const doc = logValueTemporarily(
    parser.parseFromString(wrapHtml5(html), "text/html"),
    "initialdoc"
  );

  return doc.getElementsByTagName("body")[0];
}
