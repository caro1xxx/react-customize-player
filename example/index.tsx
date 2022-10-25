import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactVideoPlayer } from '../.';
const App = () => {
  return (
    <div>
      <div
        style={{ width: '100px', height: '100px', display: 'inline-block' }}
      ></div>
      <ReactVideoPlayer
        height="340px"
        width="600px"
        videoUrl="https://bezos.life/download.mp4"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
