import './about.css'
import { template } from "../utils";

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
          <dd>by <a href="https://github.com/shikaan">Manuel Spagnolo</a></dd>
          <dd>Version ${window.VERSION}</dd>
        </center>
        <h3>Credits</h3>
        <ul class="nes-list is-disc">
          <li><a href="https://github.com/nostalgic-css/NES.css">NES.css</a> for the user interface</li>
          <li>Inspired by <a href="http://web.archive.org/web/20080228054410/http://www.davebollinger.com/works/pixelspaceships/">Dave Bollinger's Pixel Spaceships</a></li>
        </ul>
      </section>
    </span>
  `)

  render() {
    return this.template.create() as HTMLElement;
  }
}