import React from "react"
import WCMImage2 from "./wcmimage.mjs"
import * as topperStyles from "../css/topper2.module.less"

const Topper2 = ({ settings, wcmData }) => {
  const { Topper_Style, Title, Deck, Image, Image_Caption, Image_Credits, Inverted_Colors } = settings

  const headerDekStyleList = () => {
    switch(Topper_Style) {
      case "stacked": 
        return [topperStyles.center];
      case "full-screen": 
        return [
          topperStyles.headerDekAlwaysTop, topperStyles.center,
          ... (Inverted_Colors === "black-text-white-bg") ? [topperStyles.blackTextWhiteBg] : [topperStyles.whiteTextBlackBg]
        ];
      case "side-by-side": 
        return [];
      // TODO
      default: 
        return [];
  }
  }

  const headerStyleList = () => {
    switch(Topper_Style) {
        case "stacked": 
          return [topperStyles.header];
        case "full-screen": 
          return [topperStyles.header, topperStyles.center, topperStyles.whiteText];
        case "side-by-side": 
          return [topperStyles.header];
        // TODO
        default: 
          return [];
    }
  }

  const deckStyleList = () => {
    switch(Topper_Style) {
        case "stacked": 
          return [topperStyles.dek];
        case "full-screen": 
          return [topperStyles.dek, topperStyles.center, topperStyles.whiteText];
        case "side-by-side": 
          return [topperStyles.dek];
        // TODO
        default: 
          return [];
    }
  }

  const ImageHTML = () => <WCMImage2 wcm={Image} alt="TKTKTK" lz={false} wcmData={wcmData} cap={Image_Caption} cred={Image_Credits}/>

  const TopperHtml = () => {
    switch (Topper_Style) {
      case "full-screen": 
        return (
          <>
            <div className={topperStyles.imageFullScreen}>
              <ImageHTML/>
            </div>
            <div className={headerDekStyleList().join(' ')}>
              <h1 className={headerStyleList().join(' ')}>{Title}</h1>
              <h2 className={deckStyleList().join(' ')}>{Deck}</h2>
            </div>
          </>
        );
        
      case "stacked":
        return (
          <div className={topperStyles.topperContainerStacked}>
            <div className={headerDekStyleList().join('')}>
              <h1 className={headerStyleList().join(' ')}>{Title}</h1>
              <h2 className={deckStyleList().join(' ')}>{Deck}</h2>
            </div>
            <ImageHTML/>
          </div>
        );
    }
  }
    
  return (     
      <TopperHtml/>
    )
  }

export default Topper2