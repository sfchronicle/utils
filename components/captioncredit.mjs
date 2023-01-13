import React from 'react'
import * as capcredStyles from "../styles/modules/captioncredit.module.less"

const CaptionCredit = (props) => {
  let {caption, credit, extraStyles} = props

  let captionCss = [capcredStyles.cFigCap, "topper-image", "caption"];
  if (extraStyles) captionCss = captionCss.concat(extraStyles);

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