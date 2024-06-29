export function logValueTemporarily(value, name = "temp") {
  console.info({ [name]: value, json: JSON.parse(JSON.stringify(value)) });
  window[name] = value;
  return value;
}

export class MobxRef {
  constructor(value) {
    this.value = value;
  }
}
