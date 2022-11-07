import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactVideoPlayer } from '../.';
const App = () => {
  return (
    <div>
      <ReactVideoPlayer
        high="530px"
        long="700px"
        videoUrl="http://bezos.life/test-video.mp4"
        bufferColor="pink"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
