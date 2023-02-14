import React from "react"
import Heading from "./heading.mjs"
import TopperImage from "./topperimage.mjs"
import CaptionCredit from "./captioncredit.mjs"
import CaptionCreditSlideshow from "./slideshow/captioncreditslideshow.mjs"
import ImageSlideshow from "./slideshow/imageslideshow.mjs"
import * as topperStyles from "../styles/modules/topper2.module.less"
import * as imageStyles from "../styles/modules/topperimage.module.less"

const Topper2 = ({ settings, wcmData }) => {
  const {
    Topper_Style, Title, Title_Style, Deck, Image, Image_Alt, Image_Caption, Image_Credits,
    HeaderDek_Vertical_Position, HeaderDek_Vertical_Offset, HeaderDek_Horizontal_Offset, HeaderDek_Horizontal_Position, Inverted_Colors
  } = settings

  const headerDekStyleList = () => {
    switch (Topper_Style) {
      case "stacked":
      case "no-visual":
        return [topperStyles.headerDekStacked, " mw-lg mt-lg mb-md"];
      case "full-screen":
        // Check if css ":root" is accessible
        if (typeof window != "undefined") {
          // Apply margin offsets from spreadsheet
          calculatefullScreenOffsets();
        }

        return [
          topperStyles.headerDekFullScreen,
          // Add styling for header-deck container position
          fullScreenHorizontalCss(),
          // Add styling for text position inside header-deck
          ... (HeaderDek_Vertical_Position === "top") ? [topperStyles.headerDekTop] : [topperStyles.headerDekBottom],
          // Add styling for header-deck container background
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
    switch (Topper_Style) {
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

    // Apply extra custom styling if it exists in the spreadsheet
    if (Title_Style !== "") {
      let extraStyles = Title_Style.split(", ");
      defaultStyles = defaultStyles.concat(extraStyles);
    }

    return defaultStyles;
  }

  const deckStyleList = () => {
    switch (Topper_Style) {
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

  /** Converts wcm string from spreadsheet into a list of WCM ids */
  const getWcmIdList = (listStr) => {
    return listStr.split(";").map((d) => parseInt(d));
  }

  /** Checks if WCM list represents an image slideshow */
  const isSlideshow = (wcmIdList) => {
    return (wcmIdList.length > 1);
  }

  /** Converts string from spreadsheet into a list and pads the list if the length is incorrect */
  const convertStringToList = (str, size) => {
    var list = str.split(";");
    if (list.length === size) return list;

    for (var i = (list.length - 1); i < (size - 1); i++) {
      list.push("");
    }

    console.error(`The topper slideshow does not have the correct amount of metadata!`);
    return list;
  }

  const ImageHTML = () => <TopperImage wcm={Image} alt={Image_Alt} wcmData={wcmData} />
  const FullScreenImageHTML = () => <TopperImage wcm={Image} alt={Image_Alt} wcmData={wcmData} overrideCssList={[imageStyles.cImgFullscreen]} />
  const ImageSlideshowHTML = () =>
    <ImageSlideshow
      wcmData={wcmData}
      imageList={wcmIdList}
      altList={convertStringToList(Image_Alt, wcmIdList.length)}
      topperStyle={Topper_Style}
    />

  const wcmIdList = getWcmIdList(Image);
  const TopperHtml = () => {
    switch (Topper_Style) {
      case "full-screen":
        let containerCss = isSlideshow(wcmIdList) ? topperStyles.topperContainerSlideshowFullScreen : topperStyles.topperContainerFullScreen;
        return (
          <>
            <div className={containerCss}>
              <figure className={`topper-image ${topperStyles.imageFullScreen}`} aria-labelledby="topperCaptionText">
                {isSlideshow(wcmIdList) && <ImageSlideshowHTML />}
                {!isSlideshow(wcmIdList) && <FullScreenImageHTML />}

                {/* This caption-credit only shows when the screen size is tablet or mobile */}
                {isSlideshow(wcmIdList) &&
                  <CaptionCreditSlideshow
                    captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                    creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                    extraStyles={topperStyles.hideWhenDesktop}
                  />
                }
                {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={topperStyles.hideWhenDesktop} />}
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
              {/* This caption-credit only shows when the screen size is desktop */}
              {isSlideshow(wcmIdList) &&
                <CaptionCreditSlideshow
                  captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                  creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                  extraStyles={[topperStyles.hideWhenTablet, topperStyles.smallPaddingLeft]}
                />
              }
              {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.hideWhenTablet, topperStyles.smallPaddingLeft]} />}
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
                {isSlideshow(wcmIdList) && <ImageSlideshowHTML />}
                {!isSlideshow(wcmIdList) && <ImageHTML />}
                {isSlideshow(wcmIdList) &&
                  <CaptionCreditSlideshow
                    captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                    creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                    extraStyles={[topperStyles.smallPaddingLeftWhenTablet]}
                  />
                }
                {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.smallPaddingLeftWhenTablet]}/>}
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

  /** Calculate offsets for header-deck container based on the spreadsheet, for full-screen toppers only **/
  const calculatefullScreenOffsets = () => {
    var r = document.querySelector(':root');

    let verticalOffset = convertStringToNumber(HeaderDek_Vertical_Offset, (HeaderDek_Vertical_Position === "bottom"));
    let horizontalOffset = convertStringToNumber(HeaderDek_Horizontal_Offset, (HeaderDek_Horizontal_Position === "right"));

    r.style.setProperty('--headerDek-vertical-offset', verticalOffset + "px");
    r.style.setProperty('--headerDek-horizontal-offset', horizontalOffset + "px");
  }

  /** Convert offset values from the spreadsheet into Number type **/
  const convertStringToNumber = (maybeStr, isFlipped) => {
    var num = 0;
    if (typeof (maybeStr) === "string") {
      // remove all non-number characters and "-" from string
      num = Number(maybeStr.replace(/(?!^)-|[^0-9-]/g, ''))
    } else {
      num = maybeStr
    }

    if (isNaN(num)) num = 0;
    if (isFlipped) num *= -1;

    return num;
  }

  return (
    <TopperHtml />
  )
}

export default Topper2