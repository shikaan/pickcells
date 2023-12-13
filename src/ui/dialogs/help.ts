import './help.css'
import { template } from "../utils";

export class HelpDialog {
  template = template(`
    <span>
      <header>
        <h2>Help</h2>
        <button class="nes-btn is-error close">X</button>
      </header>
      <section>
        <p><b>PickCells</b> is an app for creating pixel art through procedural generation.</p>
        
        <h4>Getting Started</h4>
        <p>Select a tool, draw on the grid, and hit <i>Generate</i>.</p> 
        <p>Check out <a href="#examples">the examples</a> for some inspiration.</p>
      
        <h4>Tools</h4>
        <ul class="nes-list is-disc">
          <li>
            <div class="tool-badge border"></div>Pencil<br/>
            Outline shapes and define details
          </li>
          <li>
            <div class="tool-badge filled"></div>Color<br/>
            Fill areas with the selected color
          </li>
          <li>
            <div class="tool-badge empty"></div>Eraser<br/>
            Delete existing pixels
          </li>
          <li>
            <div class="tool-badge filled-empty"></div><div class="tool-badge filled-border"></div>Striped<br/>
            Randomly render one of the two tools
          </li>
        </ul>

        <h4>Exporting</h4>
        <p>Right-click on any preview to save it.</p>
      </section>
    </span>
  `)

  render() {
    return this.template.create() as HTMLElement;
  }
}