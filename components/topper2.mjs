import React from "react"
import WCMImage from "./wcmimage.mjs"
import * as topperStyles from "../css/topper2.module.less"

const Topper2 = ({ settings }) => {
  const { Title, Deck } = settings

    return (
      <div className={topperStyles.topperContainer}>
          <h1 className={[topperStyles.header, topperStyles.center].join(' ')}>{Title}</h1>
          <h2 className={[topperStyles.dek, topperStyles.center].join(' ')}>{Deck}</h2>
          <WCMImage wcm={20374215} alt="TKTKTK" lz={false}/>
      </div>
    )
  }

export default Topper2