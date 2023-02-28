import React from 'react'

const CaptionCredit = ({ caption, credit, extraStyles, creditStyles = [], isBrandStylesRemoved = false }) => {
  let captionCss = ["topper-image", "caption"];
  if (extraStyles) {
    captionCss = (isBrandStylesRemoved) ? extraStyles : captionCss.concat(extraStyles);
  }

  let creditCss = `credit ${creditStyles.join(" ")}`
  return (
    <>
      {caption && credit && (
        <figcaption className={captionCss.join(' ')}>
          {caption} <span className={creditCss}>{credit}</span>
        </figcaption>
      )}
      {!caption && credit && (
        <figcaption className={captionCss.join(' ')}>
          <span className={creditCss}>{credit}</span>
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