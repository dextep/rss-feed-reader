import React, { useEffect } from "react";
import "./styles.scss";

export default function FeedModal({
  title,
  content,
  onFeedModalClose,
  openLink,
}) {
  useEffect(() => {
    const escFunction = (event) => {
      if (event.keyCode === 27) {
        onFeedModalClose();
      }
    };
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [onFeedModalClose]);

  return (
    <div className="modal">
      <h2
        className="modal--title"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div
        className="modal--content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="actions">
        <button
          className="modal--button modal--button--left"
          onClick={() => onFeedModalClose()}
        >
          Close
        </button>
        <button
          className="modal--button modal--button--right"
          onClick={() => openLink()}
        >
          Continue Reading
        </button>
      </div>
    </div>
  );
}