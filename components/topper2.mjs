import React from "react"
import Heading from "./heading.mjs"
import WCMImage2 from "./wcmimage2.mjs"
import * as topperStyles from "../styles/modules/topper2.module.less"

const Topper2 = ({ settings, wcmData, lazyloader }) => {
  const { 
    Topper_Style, Title, Deck, Image, Image_Caption, Image_Credits
  } = settings

  const headerDekStyleList = () => {
    switch(Topper_Style) {
      case "stacked":
      case "no-visual":
        return ["mw-lg ", topperStyles.topperContainerStacked];
      case "full-screen": 
        // TODO
        return [];
      case "side-by-side": 
        return [];
    }
  }

  const headerStyleList = () => {
    switch(Topper_Style) {
      case "stacked": 
      case "no-visual":
        return ["hed", topperStyles.hedStacked];
      case "full-screen": 
        // TODO
        return ["hed"];
      case "side-by-side": 
        return ["hed"];
    }
  }

  const deckStyleList = () => {
    switch(Topper_Style) {
      case "stacked":
      case "no-visual": 
        return ["deck", topperStyles.deckStacked];
      case "full-screen": 
        // TODO
        return ["deck"];
      case "side-by-side": 
        return ["deck"];
    }
  }

  const ImageHTML = () => <WCMImage2 wcm={Image} alt="TKTKTK" isNotLazyloaded={false} wcmData={wcmData} cap={Image_Caption} cred={Image_Credits} lazyloader={lazyloader} isFullScreenTopper={false}/>

  const TopperHtml = () => {
    switch (Topper_Style) {
      // TODO
      case "full-screen": 
        return (<></>);

      case "stacked":
        return (
          <>
          <div className={topperStyles.topperContainerStacked}>
            <div className={headerDekStyleList().join('')}>
              <Heading
                level={1}
                text={Title}
                className={headerStyleList().join(' ')}
              />
              <Heading
                level={2}
                text={Deck}
                className={deckStyleList().join(' ')}
              />
            </div>
            <div className={topperStyles.imageStacked}>
              <ImageHTML/>
            </div>
          </div>
          </>
        );

      case "no-visual":
        return (
          <>
          <div className={topperStyles.topperContainerStacked}>
            <div className={headerDekStyleList().join('')}>
              <Heading
                level={1}
                text={Title}
                className={headerStyleList().join(' ')}
              />
              <Heading
                level={2}
                text={Deck}
                className={deckStyleList().join(' ')}
              />
            </div>
          </div>
          </>
        );
    }
  } 

  return (     
      <TopperHtml/>
    )
  }

export default Topper2