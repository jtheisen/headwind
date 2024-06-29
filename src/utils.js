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
