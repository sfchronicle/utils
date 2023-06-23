import React, { useEffect, useState, useRef } from "react"

const CaptionCreditSlideshow = ({ captionList, creditList, listSize, extraStyles, creditStyles = [] }) => {
  let captionCss = ["topper-image", "caption"];
  if (extraStyles) {
    captionCss = extraStyles.concat(captionCss);
  }

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
      setIndex((prevIndex) => (prevIndex === listSize - 1) ? 0 : prevIndex + 1);
    },
      4000 // Delay for switching images
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const hasCaption = (captionList.length > 0)
  const hasCredit = (creditList.length > 0)
  let creditCss = `credit ${creditStyles.join(" ")}`
  return (
    <>
      {hasCaption && hasCredit && (
        <figcaption className={captionCss.join(' ')}>
          {captionList[index]} <span className={creditCss}>{creditList[index]}</span>
        </figcaption>
      )}
      {!hasCaption && hasCredit && (
        <figcaption className={captionCss.join(' ')}>
          <span className={creditCss}>{creditList[index]}</span>
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