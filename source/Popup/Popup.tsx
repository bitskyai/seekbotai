import * as React from 'react';
import { browser, Tabs } from 'webextension-polyfill-ts';
import {
  Button, DatePicker, Space, version,
} from 'antd';

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

      <div className="App">
        <h1>
          antd version:
          {' '}
          {version}
        </h1>
        <Space>
          <DatePicker />
          <Button type="primary">Primary Button</Button>
        </Space>
      </div>
    </section>
  );
}

export default Popup;
