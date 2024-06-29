export function logValueTemporarily(value, name = "temp") {
  console.info({ [name]: value });
  window[name] = value;
}
