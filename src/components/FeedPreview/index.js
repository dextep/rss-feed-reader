import React, {useEffect, useState} from "react";
import './styles.scss'
import Parser from 'rss-parser'
import FeedModal from '../FeedModal'
import magnifier from './loupe.svg'

export default function FeedPreview (props) {

    const TIME_RELOAD = 60000; //60sec
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    const [modal, setModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(false);
    const [searching, setSearching] = useState("");
    const [error, setError] = useState(false);
    const [listOfFeedItems, setListOfFeedItems] = useState([]);
    const [feedInfo, setFeedInfo] = useState({});

    const getListOfFeedItems = url => {
        const parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'enclosure'],
                ]
            }
        });
        parser.parseURL(CORS_PROXY+url)
            .then(response => {
                setListOfFeedItems(response.items);
                setFeedInfo(response);
            })
            .catch(error => {
                setError(true);
                console.log(url + " - " + error.message);
            })
    };

    useEffect(() => {
        getListOfFeedItems(props.url);
        const interval = setInterval(() => {
            getListOfFeedItems(props.url);
        }, TIME_RELOAD);
        return () => {
            clearInterval(interval);
        };
    }, [props.url, TIME_RELOAD]);

    function timeDiff(curr, prev) {
        const ms_Min = 60 * 1000;     // milliseconds in Minute
        const ms_Hour = ms_Min * 60;  // milliseconds in Hour
        const ms_Day = ms_Hour * 24;  // milliseconds in day
        const ms_Mon = ms_Day * 30;   // milliseconds in Month
        const ms_Yr = ms_Day * 365;   // milliseconds in Year
        const diff = curr - prev;     //difference between dates.

        // If the diff is less then milliseconds in a minute
        return diff < ms_Min ?
            Math.round(diff / 1000) + ' seconds ago'
            : (diff < ms_Hour) ?
                Math.round(diff / ms_Min) + ' minutes ago'
                : (diff < ms_Day) ?
                    Math.round(diff / ms_Hour) + ' hours ago'
                    : (diff < ms_Mon) ?
                        'Around ' + Math.round(diff / ms_Day) + ' days ago'
                        : (diff < ms_Yr) ?
                            'Around ' + Math.round(diff / ms_Mon) + ' months ago'
                            :
                            'Around ' + Math.round(diff / ms_Yr) + ' years ago';
    }

    return (
        <div>
            {
                modal &&
                <FeedModal content={listOfFeedItems[selectedItemId].content}
                           title={listOfFeedItems[selectedItemId].title}
                           onFeedModalClose={ () => setModal(false) }
                           openLink={ () => window.open(listOfFeedItems[selectedItemId].link) }
                />
            }
            <div className="feeds-box">
                <div className="feeds-box__header">
                    <h1 className="header-primary"><a className="header-primary--title" href={feedInfo.link} >{feedInfo.title}</a></h1>
                    <div className="look-for-box">
                        <img className="look-for-box__icon"  src={magnifier}  alt={magnifier}/>
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
                                <button className="error-message--button" onClick={ () => getListOfFeedItems(props.url)}>Ok</button>
                            </div>

                        ) :
                        [
                            (
                                listOfFeedItems.length === 0 &&
                                    <h3>Loading...</h3>
                            ),
                            (
                                listOfFeedItems.filter( item => item.title.toLowerCase().includes(searching.toLowerCase())).map((item, i) => {
                                    return (
                                        <div className="item"
                                             onClick={() => {
                                                 setModal(true);
                                                 setSelectedItemId(i);
                                             }}
                                             key={i}>
                                            {
                                                typeof item.enclosure !== 'undefined' &&
                                                <div className="item__img">
                                                    <img className="img" src={item.enclosure.$.url} alt={"Preview"}/>
                                                </div>
                                            }
                                            <div className="item__title">
                                                <h1 className="header-secondary">
                                                    {/*By default, React does not allow create tags from string variables because this is too dangerous. Unfortunately we got it in title.*/}
                                                    <span className="header-secondary--title"  dangerouslySetInnerHTML={{__html: item.title}} />
                                                </h1>
                                                <p className="header-secondary--date">{timeDiff(new Date(),new Date(item.pubDate))}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )
                        ]
                    }
                </div>
            </div>
        </div>
    );
}