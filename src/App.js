import React from 'react';
import FeedPreview from './components/FeedPreview/index'

function App() {
  return (
    <div className="App">
        <FeedPreview url="https://www.gamespot.com/feeds/mashup/"/>
        <FeedPreview url="http://feeds.bbci.co.uk/news/rss.xml"/>
        <FeedPreview url="http://www.reddit.coms/.rss"/>
    </div>
  );
}

export default App;
