let uniqueNodeKeyCounter = 0;

export class ONode {
  constructor() {
    this.key = ++uniqueNodeKeyCounter;
  }

  label() {
    return "?";
  }
}

export class OElement extends ONode {
  static type = "element";

  constructor(tagName, childNodes) {
    super();
    this.tagName = tagName;
    this.childNodes = childNodes;
  }

  label() {
    return this.tagName;
  }
}

export class OText extends ONode {
  static type = "text";

  constructor(textContent) {
    super();
    this.textContent = textContent;
  }
}

export class OUnknown extends ONode {
  static type = "unkown";
}

export function makeTreeFromNode(node) {
  switch (node.nodeType) {
    case Node.DOCUMENT_NODE:
      return makeTreeFromNode(node.children[0]);
    case Node.ELEMENT_NODE:
      return new OElement(
        node.tagName,
        [...node.childNodes].map(makeTreeFromNode)
      );
    case Node.TEXT_NODE:
      return new OText(node.textContent);
    default:
      return new OUnknown();
  }
}
