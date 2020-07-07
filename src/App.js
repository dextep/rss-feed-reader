import React from 'react';
import FeedPreview from './components/FeedPreview/index'

function App() {
  return (
    <div className="App">
        <FeedPreview url={'https://www.gamespot.com/feeds/mashup/'}></FeedPreview>
    </div>
  );
}

export default App;
