import Component from "./component";

interface optionsType {
  content?: string;
  attributes?: Record<string, any>;
  childrens?: Array<Node> | Array<string>;
  children?: Node | string;
}

export default function Tag<T extends keyof HTMLElementTagNameMap>(
  type: T,
  options: optionsType
) {
  const element = document.createElement(type);
  element.innerText = options?.content ?? "";

  if (options?.childrens) {
    options.childrens.forEach((children) => {
      appendChild(element, children);
    });
  } else if (options?.children) {
    appendChild(element, options.children);
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([index, value]) => {
      if (!value) return;
      if (typeof value === "function") {
        const elementAttributable = element as unknown as Record<
          string,
          Function
        >;
        elementAttributable[index] = value as Function;
      } else {
        if (index === "target") {
          if (options.attributes?.value) {
            value.value = options.attributes.value;
          }
        } else {
          element.setAttribute(index, value);
        }
      }
    });
  }
  return element;
}

function appendChild(
  element: HTMLElement,
  children: Node | string | Component
) {
  if (children instanceof Component) {
    appendChild(element, children._render());
  } else {
    element.append(children);
  }
}
