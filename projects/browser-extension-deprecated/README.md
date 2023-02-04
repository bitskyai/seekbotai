This is a [Bookmark Intelligence](https://www.bitsky.ai/) browser extension, automate capture bookmark website screenshots, save bookmark website content, and easy-to-find bookmarks with powerful search engine

Based on [plasmo](https://github.com/PlasmoHQ/plasmo)

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup/index.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options/index.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a file to the `content` folder, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
# or
yarn build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.
