# my-framework

## Exemplo de uso

```ts
import Component from "./component";
import Tag from "./objectHtml";

class input extends Component {
  constructor() {
    super();
    this.setState({ value: "..." });
  }

  render() {
    return Tag("input", {
      attributes: {
        oninput: (e: any) => {
          const target = e.target as HTMLInputElement;
          this.state.value = target.value.toUpperCase();
          target.value = this.state.value;
        },
        type: "text",
        name: "input",
        value: this.state.value,
      },
    });
  }
}

document.body.append((new input)._render())
```
