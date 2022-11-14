import * as React from 'react';
import {
  Button, DatePicker, Space, version,
} from 'antd';

import './styles.scss';

function Options() {
  return (
    <div>
      <form>
        <p>
          <label htmlFor="username">Your Name</label>
          <br />
          <input type="text" id="username" name="username" spellCheck="false" autoComplete="off" required />
        </p>
        <p>
          <label htmlFor="logging">
            <input type="checkbox" name="logging" />
            {' '}
            Show the features enabled on each page in the console
          </label>

          <p>cool cool cool</p>
        </p>
      </form>

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
    </div>
  );
}

export default Options;
