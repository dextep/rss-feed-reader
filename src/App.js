import React from 'react';
import FeedPreview from './components/FeedPreview/index'

function App() {
  return (
    <div className="App">
        <FeedPreview url="https://www.gamespot.com/feeds/mashup/"/>
        <FeedPreview url="http://www.reddit.com/.rss"/>
        <FeedPreview url="http://feeds.bbci.co.uk/news/rss.xml"/>
    </div>
  );
}

export default App;
