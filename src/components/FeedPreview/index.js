import React, {useState, useEffect, useCallback} from "react";
import './styles.scss'
import Parser from 'rss-parser'
import FeedModal from '../FeedModal'

export default function FeedPreview (props) {

    const TIME_RELOAD = 60000; //60sec
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    const [modal, setModal] = useState(false);
    const [itemId, setItemId] = useState(false);
    const [searching, setSearching] = useState("");
    const [error, setError] = useState(false);
    const [listings, setListings] = useState([]);
    const [data, setData] = useState({});




    const escFunction = useCallback((event) => {
        if(event.keyCode === 27) {
            setModal(false)
        }
    }, []);


    const getListings = async url => {

        const parser = new Parser({
            customFields: {
                item: [
                    ['media:content', 'enclosure'],
                ]
            }
        });

        await parser.parseURL(CORS_PROXY+url)
            .then(response => {
                setListings(response.items);
                setData(response);
            })
            .catch(error => {
                setError(true);
                console.log(url + " - " + error.message);
            })
    };

    useEffect(() => {
        getListings(props.url).then();
        const interval = setInterval(() => {
            getListings(props.url).then();
        }, TIME_RELOAD);
        document.addEventListener("keydown", escFunction, false);

        return () => {
            clearInterval(interval);
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [props.url, TIME_RELOAD, escFunction]);

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
            {
                modal &&
                <FeedModal content={listings[itemId].content} title={listings[itemId].title} onFeedModalClose={ () => setModal(false) } openLink={ () => window.open(listings[itemId].link) }/>
            }
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
                                <button className="error-message--button" onClick={ () => getListings(props.url)}>Ok</button>
                            </div>

                        ) :
                        [
                            (
                                listings.length === 0 &&
                                    <h3>Loading...</h3>
                            ),
                            (
                                listings.filter( item => item.title.toLowerCase().includes(searching.toLowerCase())).map((item, i) => {
                                    return (
                                        <div className="item"
                                             onClick={() => {
                                                 setModal(true);
                                                 setItemId(i);
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