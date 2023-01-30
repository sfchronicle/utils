import React from "react"
import Heading from "./heading.mjs"
import WCMImage2 from "./wcmimage2.mjs"
import CaptionCredit from "./captioncredit.mjs"
import * as topperStyles from "../styles/modules/topper2.module.less"

const Topper2 = ({ settings, wcmData, lazyloader }) => {
  const { 
    Topper_Style, Title, Title_Style, Deck, Image, Image_Alt, Image_Caption, Image_Credits, 
    HeaderDek_Vertical_Position, HeaderDek_Vertical_Offset, HeaderDek_Horizontal_Offset, HeaderDek_Horizontal_Position, Inverted_Colors 
  } = settings

  const headerDekStyleList = () => {
    switch(Topper_Style) {
      case "stacked":
      case "no-visual":
        return [topperStyles.headerDekStacked, " mw-lg mt-lg mb-md"];
      case "full-screen": 
        // apply margin offsets from spreadsheet
        if (typeof window != "undefined") {
          calculatefullScreenOffsets();
        }

        return [
          topperStyles.headerDekFullScreen, fullScreenHorizontalCss(),
          ... (HeaderDek_Vertical_Position === "top") ? [topperStyles.headerDekTop] : [topperStyles.headerDekBottom],
          ... (Inverted_Colors === "black-text-white-bg") ? [topperStyles.blackTextWhiteBg] : [topperStyles.whiteTextBlackBg]
        ];
      case "side-by-side": 
        return [];
    }
  }

   /** get horizontal positioning css for full screen header-deck container **/
   const fullScreenHorizontalCss = () => {
    switch (HeaderDek_Horizontal_Position) {
      case "left": return topperStyles.headerDekLeft;
      case "right": return topperStyles.headerDekRight;
      case "center": return topperStyles.headerDekCenter;
    }
  }

  const headerStyleList = () => {
    let defaultStyles; 
    switch(Topper_Style) {
      case "stacked": 
        defaultStyles = [];
        break;
      case "no-visual":
        defaultStyles = ["left"];
        break;
      case "full-screen": 
        defaultStyles = [topperStyles.hedFullScreen, fullScreenTextAlignCss()];
        break;
      case "side-by-side": 
        defaultStyles = [];
        break;
    }

    if (Title_Style !== "") {
      let extraStyles = Title_Style.split(", ");
      defaultStyles = defaultStyles.concat(extraStyles);
    }

    return defaultStyles;
  }

  const deckStyleList = () => {
    switch(Topper_Style) {
      case "stacked":
        return ["deck"];
      case "no-visual": 
        return ["deck left"];
      case "full-screen": 
        return ["deck", topperStyles.deckFullScreen, fullScreenTextAlignCss()];
      case "side-by-side": 
        return ["deck"];
    }
  }

  /** get text alignment based on header-deck position **/
  const fullScreenTextAlignCss = () => {
    switch (HeaderDek_Horizontal_Position) {
      case "left": return topperStyles.textAlignLeft;
      case "right": return topperStyles.textAlignLeft;
      case "center": return topperStyles.textAlignCenter;
    }
  }

  const ImageHTML = () => <WCMImage2 wcm={Image} alt={Image_Alt} isNotLazyloaded={false} wcmData={wcmData} lazyloader={lazyloader} isFullScreenTopper={false}/>
  const FullScreenImageHTML = () => <WCMImage2 wcm={Image} alt={Image_Alt} isNotLazyloaded={false} ratio={calculateFullScreenImageRatio()} wcmData={wcmData} lazyloader={lazyloader} isFullScreenTopper={true}/>
  
  const TopperHtml = () => {
    switch (Topper_Style) {
      case "full-screen": 
        return (
          <>
          <div className={topperStyles.topperContainerFullScreen}>
              <figure className={`topper-image ${topperStyles.imageFullScreen}` } aria-labelledby="topperCaptionText">
                <FullScreenImageHTML/>
                <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={topperStyles.hideWhenDesktop}/>
              </figure>
              <div className={headerDekStyleList().join(' ')}>
                <Heading level={1} text={Title}
                  className={headerStyleList().join(' ')}
                />
                <Heading
                  level={2}
                  text={Deck}
                  className={deckStyleList().join(' ')}
                />
              </div>
          </div>
          <div className="topperCaptionText">
            <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.hideWhenMobile, topperStyles.smallPaddingLeft]}/>
          </div>
          </>
        );

      case "stacked":
        return (
          <>
          <div>
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
            <figure className={`mw-xl ml-auto mr-auto ${topperStyles.imageStacked}`}>
              <ImageHTML/>
              <CaptionCredit caption={Image_Caption} credit={Image_Credits} />
            </figure>
          </div>
          </>
        );

      case "no-visual":
        return (
          <>
          <div>
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

  const calculatefullScreenOffsets = () => {
    var r = document.querySelector(':root');

    let verticalOffset = convertStringToNumber(HeaderDek_Vertical_Offset, (HeaderDek_Vertical_Position === "bottom"));
    let horizontalOffset = convertStringToNumber(HeaderDek_Horizontal_Offset, (HeaderDek_Horizontal_Position === "right"));

    r.style.setProperty('--headerDek-vertical-offset', verticalOffset + "px" ); 
    r.style.setProperty('--headerDek-horizontal-offset', horizontalOffset + "px"); 
  }

  const convertStringToNumber = (maybeStr, isFlipped) => {
    var num = 0;
    if (typeof(maybeStr) === "string") {
      // remove all non-number characters and "-" from string
      num = Number(maybeStr.replace(/(?!^)-|[^0-9-]/g,''))
    } else {
      num = maybeStr
    }

    if (isNaN(num)) num = 0;
    if (isFlipped) num *= -1;

    return num;
  }

  const calculateFullScreenImageRatio = () => {
      // ratio needs to account for height of nav bar which is 37px
    const windowRatio = ((window.innerHeight-37) / window.innerWidth)*100;
    let fullScreenRatio = "56.25%"; // defaults to 16/9;

    if (windowRatio < 56.25) fullScreenRatio = (windowRatio + "%")
    return fullScreenRatio
  }

  return (     
      <TopperHtml/>
    )
  }

export default Topper2