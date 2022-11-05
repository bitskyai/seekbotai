import * as React from 'react';
import { browser, Tabs } from 'webextension-polyfill-ts';

import './styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

function Popup() {
  return (
    <section id="popup">
      <h2>Smart Bookmarks</h2>
      <button
        id="options__button"
        type="button"
        onClick={(): Promise<Tabs.Tab> => openWebPage('options.html')}
      >
        Options Page
      </button>
    </section>
  );
}

export default Popup;
