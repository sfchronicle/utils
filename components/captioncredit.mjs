import React from 'react'

const CaptionCredit = ({ caption, credit, extraStyles, isBrandStylesRemoved = false }) => {
  let captionCss = ["topper-image", "caption"];
  if (extraStyles) {
    captionCss = (isBrandStylesRemoved) ? extraStyles : captionCss.concat(extraStyles);
  }

  return (
    <>
      {caption && credit && (
        <figcaption className={captionCss.join(' ')}>
          {caption} <span className="credit">{credit}</span>
        </figcaption>
      )}
      {!caption && credit && (
        <figcaption className={captionCss.join(' ')}>
          <span className="credit">{credit}</span>
        </figcaption>
      )}
      {caption && !credit && (
        <figcaption className={captionCss.join(' ')}>
          {caption}
        </figcaption>
      )}
    </>
  )
}

export default CaptionCredit