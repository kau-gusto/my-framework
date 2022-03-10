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
          tag.state.childrens = this.state.value.split("");
        },
        type: "text",
        name: "input",
        value: this.state.value,
      },
    });
  }
}

class form extends Component {
  constructor() {
    super();
    this.setState({
      childrens: [".", ".", ".", "."],
    });
  }

  render() {
    return Tag("form", {
      childrens: [
        new input(),
        ...this.state.childrens.map((value: any, index: number) => {
          return Tag("button", {
            childrens: [value, "-", index],
            attributes: {
              onclick: () => {
                this.state.childrens = this.state.childrens.filter(
                  (_: any, indexLocal: number) => index != indexLocal
                );
              },
              key: index,
            },
          });
        }),
      ],
      attributes: {
        onsubmit: (e: FormDataEvent) => {
          e.preventDefault();
        },
      },
    });
  }
}

const tag = new form();

const app = document.querySelector<HTMLDivElement>("#app")!;

app.appendChild(tag._render());

// app.innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `;
