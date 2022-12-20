import React from "react"
import WCMImage2 from "./wcmimage.mjs"
import * as topperStyles from "../css/topper2.module.less"

const Topper2 = ({ settings, wcmData }) => {
  const { Title, Deck } = settings

    return (
      <div className={topperStyles.topperContainer}>
          <h1 className={[topperStyles.header, topperStyles.center].join(' ')}>{Title}</h1>
          <h2 className={[topperStyles.dek, topperStyles.center].join(' ')}>{Deck}</h2>
          <WCMImage2 wcm={20374215} alt="TKTKTK" lz={false} wcmData={wcmData}/>
      </div>
    )
  }

export default Topper2