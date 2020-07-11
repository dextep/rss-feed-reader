import React from "react";
import './styles.scss'

export default function FeedModal (props) {

    return (
        <div className="modal">
                <h2 className="modal--title" dangerouslySetInnerHTML={{__html: props.title}} />
            <div className="modal--content" dangerouslySetInnerHTML={{__html: props.content}} />
            <div className="actions">
                <button className="modal--button modal--button--left" onClick={() => props.onFeedModalClose() }>Close</button>
                <button className="modal--button modal--button--right" onClick={() => props.openLink() }>Continue Reading</button>
            </div>
        </div>
    )
}
