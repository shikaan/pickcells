<p align="center">
  <img width="96" height="96" src="./public/logo.png" alt="logo">
</p>

<h1 align="center">PickCells</h1>
<p align="center">
  Procedurally generate pixel art in your browser.
</p>

## Why?

Maybe you
* are in a game jam and need some quick and dirty variations on the same sprite;
* have something in mind, but that's not quite it and you need to give it a spin;
* just want to goof around and see if something useful comes up

## How?

[Click here](https://pickcells.vercel.app/).

You will be presented a grid you can fill using the tools in the sidebar. [Here](https://pickcells.vercel.app/#info) you can find more information.

## Examples

If you don't want to start from scratch, you can get starte with one of the [examples](https://pickcells.vercel.app/#examples).

### Sharing an example

1. Download your example using the <img width=16 height=16 src="./public/download.png" alt="download"> button in the sidebar
2. [Fork](https://github.com/shikaan/pickcells/fork) this project
3. Add the downloaded example in the `/public/examples` folder
4. Add the filename to the `examples` list [here](https://github.com/shikaan/pixel-art-generator/blob/0be1ddd09c9ecb14fb9252c64eac93d2eaab5093/src/ui/dialogs/examples.ts)
5. [Open a Pull Request](https://github.com/shikaan/pickcells/compare)

## Contributing

Contributions are _very_ welcome! Here's a quick intro to the project.

It is a vanilla TypeScript project built with Vite. The only included sophistication
is PostCSS plugin to handle nesting in CSS.

All the business logic aroung creating masks and sprites is in the `src/lib` folder.

All the UI code is in the `src/ui` folder, which is _very_ dumb right now: most
of the templating relies on strings, and the state is just a glorified `Proxy`.

If you want to contribute icons or graphics, please consider using PickCells itself
as we did for the icons so far.