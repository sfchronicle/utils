import React, { useEffect, useState, useRef } from "react"

const CaptionCreditSlideshow = ({ captionList, creditList, extraStyles }) => {
  let captionCss = ["topper-image", "caption"];
  if (extraStyles) captionCss = captionCss.concat(extraStyles);

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      // Set current image index
      setIndex((prevIndex) => (prevIndex === captionList.length - 1) ? 0 : prevIndex + 1);
    },
      4000 // Delay for switching images
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const hasCaption = (captionList.length > 0)
  const hasCredit = (creditList.length > 0)
  return (
    <>
      {hasCaption && hasCredit && (
        <figcaption className={captionCss.join(' ')}>
          {captionList[index]} <span className="credit">{creditList[index]}</span>
        </figcaption>
      )}
      {!hasCaption && hasCredit && (
        <figcaption className={captionCss.join(' ')}>
          <span className="credit">{creditList[index]}</span>
        </figcaption>
      )}
      {hasCaption && !hasCredit && (
        <figcaption className={captionCss.join(' ')}>
          {captionList[index]}
        </figcaption>
      )}
    </>
  )
}

export default CaptionCreditSlideshow