import React, { useState, useEffect } from "react";
import './styles.scss'
import axios from 'axios'

export default function FeedPreview (props) {

    const API_LINK = 'https://api.rss2json.com/v1/api.json?rss_url=';
    const API_KEY = 'mltpnjs79fuaizz0505a9usuj8e3wiferiymupzi'; // rss2json api key is required to get more then 10 count - https://rss2json.com/docs
    const FEED_UPDATE = 30000; //30sec

    const [initialized, setInitialized] = useState(false);
    const [searching, setSearching] = useState("");
    const [error, setError] = useState(false);
    const [url, setUrl] = useState(props.url);
    const [listings, setListings] = useState([]);
    const [data, setData] = useState({});

    const getListings = async url => {
        try {
            await axios.get(API_LINK+url,
                {
                    params: {
                        api_key: API_KEY,
                        order_by: 'pubDate',
                        count: 50
                    }
                }
            )
                .then(response => {
                    console.log(response)
                    setListings(response.data.items);
                    setData(response.data.feed);
                })
                .catch(error => {
                    setError(true);
                    console.log(url + " - " + error.toJSON().message);
                })
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        if (!initialized) {
            setUrl(url);
            getListings(url).then();
            setInitialized(true);
        }
        const interval = setInterval(() => {
            getListings(url);
        }, FEED_UPDATE);
        return () => clearInterval(interval);
    }, [initialized, url]);

    function timeDiff(curr, prev) {
        var ms_Min = 60 * 1000;     // milliseconds in Minute
        var ms_Hour = ms_Min * 60;  // milliseconds in Hour
        var ms_Day = ms_Hour * 24;  // milliseconds in day
        var ms_Mon = ms_Day * 30;   // milliseconds in Month
        var ms_Yr = ms_Day * 365;   // milliseconds in Year
        var diff = curr - prev;     //difference between dates.

        // If the diff is less then milliseconds in a minute
        if (diff < ms_Min) {
            return Math.round(diff / 1000) + ' seconds ago';
        } else if (diff < ms_Hour) {
            return Math.round(diff / ms_Min) + ' minutes ago';
        } else if (diff < ms_Day) {
            return Math.round(diff / ms_Hour) + ' hours ago';
        } else if (diff < ms_Mon) {
            return 'Around ' + Math.round(diff / ms_Day) + ' days ago';
        } else if (diff < ms_Yr) {
            return 'Around ' + Math.round(diff / ms_Mon) + ' months ago';
        } else {
            return 'Around ' + Math.round(diff / ms_Yr) + ' years ago';
        }
    }

    return (
        <div>
            <div className="feeds-box">
                <div className="feeds-box__header">
                    <h1 className="header-primary"><a className="header-primary--title" href={data.link} >{data.title}</a></h1>
                    <div className="look-for-box">
                        <svg aria-hidden="true" className="look-for-box__icon" >
                            <path d="M18 16.5l-5.14-5.18h-.35a7 7 0 10-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 112 7a5 5 0 0110 0z" />
                        </svg>
                        <input className="look-for-box__input"
                               type="text"
                               placeholder="Search..."
                               onChange={ e => setSearching(e.target.value) }/>

                    </div>
                </div>
                <div className="feeds">
                    {error ?
                        (
                            <div className="error-message">
                                <h1 className="error-message--title">An error occurred.</h1>
                                <p className="error-message--description">Try again</p>
                                <button className="error-message--button" onClick={ () => getListings(url)}>Ok</button>
                            </div>

                        ) :
                        (
                            listings.filter( item => item.title.toLowerCase().includes(searching.toLowerCase())).map((item, i) => {
                                return (
                                    <div className="item"  onClick={() => window.open(item.link)} key={i}>
                                        {
                                            typeof item.enclosure.link !== 'undefined' &&
                                            <div className="item__img">
                                                <img className="img" src={item.enclosure.link} alt={"Preview"}/>
                                            </div>
                                        }
                                        <div className="item__title">
                                            <h1 className="header-secondary">
                                                {/*By default, React does not allow create tags from string variables because this is too dangerous. Unfortunately we got it in title.*/}
                                                <span className="header-secondary--title"  dangerouslySetInnerHTML={{__html: item.title}} />
                                            </h1>
                                            {/*<h1 className="header-secondary">*/}
                                            {/*    <span className="header-secondary--description" dangerouslySetInnerHTML={{__html: item.content}} />*/}
                                            {/*</h1>*/}
                                            <p className="header-secondary--date">{timeDiff(new Date(),new Date(item.pubDate))}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )
                    }
                </div>
            </div>
        </div>
    );
}