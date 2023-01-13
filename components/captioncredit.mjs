import React from 'react'
import * as capcredStyles from "../styles/modules/captioncredit.module.less"


const CaptionCredit = (props) => {
  let {caption, credit, isFullScreenTopper} = props

  //TODO: support full screen CSS
  const CaptionCss = [capcredStyles.cFigCap, "topper-image", "caption"];

  return (
    <>
    {caption && credit && (
      <figcaption className={CaptionCss.join(' ')}>
        {caption} <span className="credit">{credit}</span>
      </figcaption>
    )}
    {!caption && credit && (
      <figcaption className={CaptionCss.join(' ')}>
        <span className="credit">{credit}</span>
      </figcaption>
    )}
    {caption && !credit && (
      <figcaption className={CaptionCss.join(' ')}>
        {caption}
      </figcaption>
    )}
    </>
  )
}

export default CaptionCredit