type ReactiveObject<T> = Record<string | symbol, T>;

function reactive<T>(object: ReactiveObject<T>, reactiveFunction: () => void) {
  const methods: ProxyHandler<ReactiveObject<T>> = {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      reactiveFunction();
      return true;
    },
  };
  return new Proxy(object, methods);
}

export default abstract class Component {
  element: HTMLElement;
  _state: ReactiveObject<any> = {};

  constructor() {
    this.element = document.createElement("div");
  }

  setState<T>(value: ReactiveObject<T>) {
    this._state = reactive<T>(value, () => {
      this._render();
    });
  }

  set state(value) {
    this.setState(value);
    this._render();
  }

  get state() {
    return this._state;
  }

  get args() {
    const atributes = this.element.getAttributeNames();
    const object: Record<string, string | null> = {};
    atributes.forEach((value) => {
      object[value] = this.element.getAttribute(value);
    });
    return object;
  }

  _render() {
    const newElement = this.render();

    if (this.element) {
      if (this.element.tagName === newElement.tagName) {
        replaceChild(this.element, newElement);
        replaceAtributes(this.element, newElement);
      } else {
        this.element.replaceWith(newElement);
        this.element = newElement;
      }
    } else {
      this.element = newElement;
    }
    return this.element;
  }

  abstract render(): HTMLElement;
}

export function reset(target: HTMLElement) {
  target.innerText = "";
  target.childNodes.forEach((node) => {
    target.removeChild(node);
  });
}

export function resetAttributes(target: HTMLElement) {
  target.getAttributeNames().forEach((value) => {
    target.removeAttribute(value);
  });
}

export function insertAttribute(
  target: HTMLElement,
  attribute: string,
  value = ""
) {
  target.setAttribute(attribute, value);
}

export function replaceAtributes(
  element: HTMLElement,
  newElement: HTMLElement
) {
  newElement.getAttributeNames().forEach((attribute) => {
    const newValueAttribute = newElement.getAttribute(attribute) ?? "";
    element.setAttribute(attribute, newValueAttribute);
  });

  element.getAttributeNames().forEach((attribute) => {
    if (!newElement.hasAttribute(attribute)) {
      element.removeAttribute(attribute);
    }
  });
}

function replaceChild(element: HTMLElement, newElement: HTMLElement) {
  if (newElement.innerHTML === element.innerHTML) return;

  const indexesElement: ChildNode[] = [];
  element.childNodes.forEach((node, index) => {
    if (!newElement.childNodes[index]) {
      indexesElement.push(node);
    }
  });
  indexesElement.forEach((node) => {
    element.removeChild(node);
  });

  const indexesNewElement: ChildNode[] = [];
  newElement.childNodes.forEach((node, index) => {
    const newNode = node as HTMLElement;
    let nodeElement: HTMLElement | null;
    if (!(newNode instanceof Text) && newNode.hasAttribute("key")) {
      nodeElement = element.querySelector(
        `[key='${newNode.getAttribute("key")}']`
      );
    } else {
      nodeElement = element.childNodes[index] as HTMLElement;
    }
    if (nodeElement) {
      if (nodeElement.nodeType !== newNode.nodeType) {
        element.replaceChild(newNode, nodeElement);
      } else {
        if (newNode instanceof Text) {
          if (nodeElement.textContent !== newNode.textContent) {
            nodeElement.textContent = newNode.textContent;
          }
        } else {
          replaceAtributes(nodeElement, newNode);
          replaceChild(nodeElement, newNode);
        }
      }
    } else {
      indexesNewElement.push(newNode);
    }
  });
  indexesNewElement.forEach((node) => {
    element.append(node);
  });
}

export function insert(target: HTMLElement, children: Node | string) {
  target.append(children);
}
