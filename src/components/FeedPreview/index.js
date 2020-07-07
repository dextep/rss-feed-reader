import React, { useState, useEffect } from "react";
import './styles.css'
import axios from 'axios'

export default function FeedPreview (props) {

    const [initialized, setInitialized] = useState(false);
    const [url, setUrl] = useState(props.url);
    const [listings, setListings] = useState([]);
    const [data, setData] = useState({});

    const getListings = async url => {
        try {
            const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=`+url);
            setListings(response.data.items);
            setData(response.data.feed);
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        if (!initialized) {
            setUrl(url);
            getListings(url);
            setInitialized(true);
        }
    });

    const openLink = url => {
        window.location.href = url;
    };

    return (
        <div>
            <h1>
                <img src={data.image} /> {data.title}
            </h1>
            {listings.length === 0 && <p>Loading...</p>}
            {listings.slice(0, 3).map((l, i) => {
                return (
                    <div key={i}>
                        <h1>{l.title}</h1>
                        <img src={l.enclosure.link}></img>
                        <div>
                            <div dangerouslySetInnerHTML={{__html: l.description}} />
                            <div dangerouslySetInnerHTML={{__html: l.content}} />
                            <button variant="primary" onClick={openLink.bind(this, l.link)}>Open</button>{" "}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}