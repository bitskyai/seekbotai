import React, { useState } from 'react';

import { browser, Tabs } from 'webextension-polyfill-ts';
import { Button, Input, Space, version } from 'antd';
import {addTag} from '../storage';

import './styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}


function Popup() {
  const [tag, setTag] = useState('');

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
        <h1>antd version: {version}</h1>
        <Space>
          <Input value={tag} onChange={e=>setTag(e?.target?.value)} placeholder="Tag name" />
          <Button type="primary" onClick={()=>addTag(tag)}>Add</Button>
        </Space>
      </div>
    </section>
  );
}

export default Popup;
