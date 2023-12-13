import './about.css'
import { template } from "../utils";

//@ts-expect-error to get the SHA from the build
const version = VERSION;

export class AboutDialog {
  template = template(`
    <span>
      <header>
        <h2>About</h2>
        <button class="nes-btn is-error close">X</button>
      </header>
      <section>
        <center>
          <h3>PickCells</h3>
          <img class="logo" src="logo.png" alt="logo" />
          <p>by <a href="https://github.com/shikaan">shikaan</a></p>
          <small>
            Version: ${version}</br>
            <a href="https://github.com/shikaan/pickcells" target="_blank">Code</a> |
            <a href="https://github.com/shikaan/pickcells/blob/main/LICENSE" target="_blank">License</a> |
            <a href="https://github.com/shikaan/pickcells/issues/new" target="_blank">Feedback</a>
          </small>
        </center>
        <h3>Credits</h3>
        <ul class="nes-list is-disc">
          <li><a href="https://github.com/nostalgic-css/NES.css">NES.css</a> for the user interface</li>
          <li>Inspired by <a href="http://web.archive.org/web/20080228054410/http://www.davebollinger.com/works/pixelspaceships/">Pixel Spaceships</a></li>
        </ul>
      </section>
    </span>
  `)

  render() {
    return this.template.create() as HTMLElement;
  }
}