import React, { useState, useEffect } from "react";
import './styles.scss'
import axios from 'axios'

export default function FeedPreview (props) {

    const [initialized, setInitialized] = useState(false);
    const [searching, setSearching] = useState("");
    const [error, setError] = useState(false);
    const [url, setUrl] = useState(props.url);
    const [listings, setListings] = useState([]);
    const [data, setData] = useState({});

    const getListings = async url => {
        try {
            await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=`+url)
                .then( response => {
                    setListings(response.data.items);
                    setData(response.data.feed);
                })
                .catch( error => {
                    setError(true);
                    console.log(url+" - "+error.toJSON().message);
                });
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
    }, [initialized, url]);

    return (
        <div>
            <div className="feeds-box">
                <div className="feeds-box__header">
                    <h1 className="header-primary"><a className="header-primary--title" href={data.link} target="_blank" >{data.title}</a></h1>
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
                                    <span className="header-secondary--title">{item.title}</span>
                                    </h1>
                                    {/*<h1 className="header-secondary">*/}
                                    {/*    <span className="header-secondary--description" dangerouslySetInnerHTML={{__html: item.content}} />*/}
                                    {/*</h1>*/}
                                    <p className="header-secondary--date">{item.pubDate}</p>
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