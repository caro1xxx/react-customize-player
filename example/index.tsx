import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactVideoPlayer } from '../.';
const App = () => {
  return (
    <div>
      <ReactVideoPlayer
        high="120px"
        long="200px"
        videoUrl="http://bezos.life/download.mp4"
        minVideoUrl=""
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
