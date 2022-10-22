import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactVideoPlayer } from '../.';

const App = () => {
  return (
    <div>
      <ReactVideoPlayer high="calc(50vh)" long="calc(50vw)" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
