import React from "react"
import Heading from "./heading.mjs"
import TopperImage from "./topperimage.mjs"
import CaptionCredit from "./captioncredit.mjs"
import CaptionCreditSlideshow from "./slideshow/captioncreditslideshow.mjs"
import ImageSlideshow from "./slideshow/imageslideshow.mjs"
import * as topperStyles from "../styles/modules/topper2.module.less"
import * as imageStyles from "../styles/modules/topperimage.module.less"

const Topper2 = ({ settings, wcmData, mods }) => {
  let {
    Topper_Style, Title, Title_Style, Deck, Image, Image_Alt, Video_Mp4, Image_Caption, Image_Credits,
    HeaderDek_Vertical_Position, HeaderDek_Vertical_Offset, HeaderDek_Horizontal_Offset,
    HeaderDek_Horizontal_Position, Inverted_Colors, Inverted_Layout, Inverted_Text_Color,
    Topper_Background_Color, Small_Visual_Max_Width, Small_Visual_Topper_Url
  } = settings

  // During server-side rendering, access to ":root" is unavailable. This is okay; we just need
  // to make sure that the site does not crash during SSR
  let r = (typeof window != "undefined") ? document.querySelector(':root') : null;

  // Handle mods here, in case the project modifies the title
  if (mods) {
    if (mods.Title) {
      Title = mods.Title
    }
  }

  const headerDekStyleList = () => {
    switch (Topper_Style) {
      case "stacked":
      case "no-visual":
        return [topperStyles.headerDekStacked, " mw-lg mt-lg mb-md"];
      case "small-visual":
        return [topperStyles.headerDekStacked, " mw-lg mt-sm mb-md"];
      case "full-screen":
        // Check if css ":root" is accessible
        if (typeof window != "undefined") {
          // Apply margin offsets from spreadsheet
          calculatefullScreenOffsets();
        }

        return [
          topperStyles.headerDekFullScreen,
          // Add styling for header-deck container horizontal position
          fullScreenHorizontalCss(),
          // Add styling for header-deck container vertical position
          fullScreenVerticalCss(),
          // Add style override for center-center position (if applicable)
          fullScreenCenterCenterCss(),
          // Add styling for header-deck container text and background color
          fullScreenHedDekContainerCss()
        ];
      case "side-by-side":
        return [
          topperStyles.headerDekSideBySide,
          // Add styling for left padding on header-deck
          ... (Inverted_Layout === "headerdek-right-image-left") ? [topperStyles.largePaddingRight] : [topperStyles.largePaddingLeft]
        ];
      case "side-by-side-portrait":
        return [
          topperStyles.headerDekSideBySide,
          // Add styling for left padding on header-deck
          ... (Inverted_Layout === "headerdek-right-image-left") ? [topperStyles.largePaddingRight] : [topperStyles.largePaddingLeft]
        ];
      default:
        console.error(`${Topper_Style} is not a valid topper style!`)
        return [];
    }
  }

  /** get horizontal positioning css for full screen header-deck container **/
  const fullScreenHorizontalCss = () => {
    switch (HeaderDek_Horizontal_Position) {
      case "left": return topperStyles.headerDekLeft;
      case "right": return topperStyles.headerDekRight;
      case "center": return topperStyles.headerDekCenterHorizontal;
    }
  }

  /** get horizontal positioning css for full screen header-deck container **/
  const fullScreenVerticalCss = () => {
    switch (HeaderDek_Vertical_Position) {
      case "top": return topperStyles.headerDekTop;
      case "center": return topperStyles.headerDekCenterVertical;
      case "bottom": return topperStyles.headerDekBottom;
    }
  }

  /** get additional positioning css for full screen center-center header-deck container **/
  const fullScreenCenterCenterCss = () => {
    return (
      HeaderDek_Horizontal_Position === "center" &&
      HeaderDek_Vertical_Position === "center"
    ) ? topperStyles.headerDekCenterCenter : "";
  }

  /** get css for full screen header-deck container text and background color **/
  const fullScreenHedDekContainerCss = () => {
    switch (Inverted_Colors) {
      case "black-text-white-bg": return topperStyles.blackTextWhiteBg;
      case "white-text-black-bg": return topperStyles.whiteTextBlackBg;
      case "black-text-no-bg": return topperStyles.blackTextNoBg;
      case "white-text-no-bg": return topperStyles.whiteTextNoBg;
    }
  }

  const headerStyleList = () => {
    let defaultStyles = [];
    switch (Topper_Style) {
      case "stacked":
      case "small-visual":
        defaultStyles = [];
        break;
      case "no-visual":
        defaultStyles = ["left"];
        break;
      case "full-screen":
        defaultStyles = [topperStyles.hedFullScreen, fullScreenTextAlignCss(), textDecorationCss()];
        break;
      case "side-by-side":
      case "side-by-side-portrait":
        defaultStyles = ["left"];
        break;
    }

    // Apply extra custom styling if it exists in the spreadsheet
    if (Title_Style && Title_Style !== "") {
      let extraStyles = Title_Style.split(", ");
      defaultStyles = defaultStyles.concat(extraStyles);
    }

    return defaultStyles;
  }

  const deckStyleList = () => {
    switch (Topper_Style) {
      case "stacked":
      case "small-visual":
        return ["deck"];
      case "no-visual":
        return ["deck left"];
      case "full-screen":
        return ["deck", topperStyles.deckFullScreen, fullScreenTextAlignCss(), textDecorationCss()];
      case "side-by-side":
      case "side-by-side-portrait":
        return ["deck left"];
      default:
        return [""]
    }
  }

  /** Get text alignment based on header-deck position **/
  const fullScreenTextAlignCss = () => {
    switch (HeaderDek_Horizontal_Position) {
      case "left": return topperStyles.textAlignLeft;
      case "right": return topperStyles.textAlignLeft;
      case "center": return topperStyles.textAlignCenter;
    }
  }

  /** Add styling for drop shadow on white text for full-screen toppers */
  const textDecorationCss = () => {
    return (Inverted_Colors === "white-text-no-bg") ? topperStyles.dropshadow : "";
  }
  /** Add styling for text color on topper slideshow captions. Note that the credits 
   * are grey when the caption is black and white when the captions are white. */
  const sideBySideCapCredColorCss = () => {
    return (Inverted_Text_Color === "black") ? topperStyles.captionTextColor : topperStyles.captionTextColorImportant;
  }

  /** Add styling for left padding on topper slideshow captions */
  const sideBySideCapCredPaddingCss = () => {
    return (Inverted_Layout === "headerdek-right-image-left") ? topperStyles.captionLargePaddingLeft : topperStyles.captionLargePaddingRight
  }

  /** Add styling for left padding on topper slideshow captions */
  const sideBySidePortraitCapCredPaddingCss = () => {
    return (Inverted_Layout === "headerdek-right-image-left") ? topperStyles.captionSmallPaddingLeft : topperStyles.captionSideBySidePortraitPadding;
  }

  /** Add styling for float position for side-by-side-portrait image */
  const sideBySidePortraitFloatCss = () => {
    return (Inverted_Layout === "headerdek-right-image-left") ? topperStyles.floatLeftWhenDesktop : topperStyles.floatRightWhenDesktop;
  }

  /** Converts wcm string from spreadsheet into a list of WCM ids */
  const getWcmIdList = (listStr) => {
    if (!listStr) return [];
    // For backwards compat, handle both ; and , as delimiters
    let charSearch = ","
    if (listStr.toString().indexOf(";") !== -1) {
      charSearch = ";"
    }
    return listStr.toString().split(charSearch).map((d) => parseInt(d));
  }

  /** Checks if WCM list represents an image slideshow */
  const isSlideshow = (wcmIdList) => {
    return (wcmIdList.length > 1);
  }

  /** Converts string from spreadsheet into a list and pads the list if the length is incorrect */
  const convertStringToList = (str, size) => {
    if (!str.includes(";")) return [];

    var list = str.split(";");
    if (list.length === size) return list;

    for (var i = (list.length - 1); i < (size - 1); i++) {
      list.push("");
    }

    console.error(`The topper slideshow does not have the correct amount of metadata!`);
    return list;
  }

  /** Returns the HTML to support video */
  const getVideoHtml = () => {
    let videoCss = "";

    switch (Topper_Style) {
      case "stacked":
      case "side-by-side":
      case "small-visual":
        videoCss = topperStyles.videoStacked;
        break;
      case "full-screen":
        videoCss = topperStyles.videoFullscreen;
        break;
      case "side-by-side-portrait":
        videoCss = `${topperStyles.videoSideBySidePortrait} ${sideBySidePortraitFloatCss()}`;
        break;
      case "no-visual":
      default:
        break;
    }

    return (
      <video className={videoCss} muted loop autoPlay playsInline poster={Video_Mp4.trim().replace('.mp4', '.jpg')}           >
        <source src={Video_Mp4.trim().replace('.mp4', '.m3u8')} type="application/vnd.apple.mpegurl" />
        <source src={Video_Mp4.trim()} type="video/mp4" />
      </video>
    )
  }

  /* Returns the corresponding image HTML for each topper style and slideshow status */
  const getMediaHTML = (isSlideshow) => {
    if (Video_Mp4) return getVideoHtml();

    if (isSlideshow) return (
      <ImageSlideshow
        wcmData={wcmData}
        imageList={wcmIdList}
        altList={convertStringToList(Image_Alt, wcmIdList.length)}
        topperStyle={Topper_Style}
        isLayoutInverted={(Inverted_Layout === "headerdek-right-image-left")}
      />
    )

    switch (Topper_Style) {
      case "stacked":
        return (
          <TopperImage
            wcm={Image}
            alt={Image_Alt}
            wcmData={wcmData}
            containerCssList={[imageStyles.cContainerStacked]}
            imageCssList={[imageStyles.cImgStacked]}
          />
        )
      case "full-screen":
        return (
          <TopperImage
            wcm={Image}
            alt={Image_Alt}
            wcmData={wcmData}
            imageCssList={[imageStyles.cImgFullscreen]}
          />
        )
      case "small-visual":
        // If there is a "Small_Visual_Max_Width" column, override the max width of the topper image
        if (r && Small_Visual_Max_Width && Small_Visual_Max_Width !== "") {
          r.style.setProperty('--small-visual-max-width', Small_Visual_Max_Width)
        }

        // If there is a custom topper image or gif url, override the WCM image
        if (Small_Visual_Topper_Url) {
          return <img
            className={imageStyles.cImgSmallVisualUrl}
            src={Small_Visual_Topper_Url}
            alt={Image_Alt}
          />
        }

        return (
          <TopperImage
            wcm={Image}
            alt={Image_Alt}
            wcmData={wcmData}
            containerCssList={[imageStyles.cContainerSmallVisual]}
            imageCssList={[imageStyles.cImgSmallVisual]}
          />
        )
      case "side-by-side":
        return (
          <TopperImage
            wcm={Image}
            alt={Image_Alt}
            wcmData={wcmData}
            containerCssList={[imageStyles.cContainerSideBySide]}
            imageCssList={[imageStyles.cImgSideBySide]}
          />)
      case "side-by-side-portrait":
        return (
          <TopperImage
            wcm={Image}
            alt={Image_Alt}
            wcmData={wcmData}
            containerCssList={[imageStyles.cContainerSideBySidePortrait, sideBySidePortraitFloatCss()]}
            imageCssList={[imageStyles.cImgSideBySidePortrait]}
          />
        )
      case "no-visual":
      default:
        return null
    }
  }

  const wcmIdList = getWcmIdList(Image);
  const TopperHtml = () => {
    switch (Topper_Style) {
      case "full-screen":
        let containerCss = isSlideshow(wcmIdList) ? topperStyles.topperContainerSlideshowFullScreen : topperStyles.topperContainerFullScreen;
        return (
          <>
            <div className={containerCss}>
              <figure className={`topper-image ${topperStyles.imageFullScreen}`} aria-labelledby="topperCaptionText">
                {getMediaHTML(isSlideshow(wcmIdList))}

                {/* This caption-credit only shows when the screen size is tablet or mobile */}
                {isSlideshow(wcmIdList) &&
                  <CaptionCreditSlideshow
                    captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                    creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                    extraStyles={[topperStyles.hideWhenDesktop]}
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
                {getMediaHTML(isSlideshow(wcmIdList))}

                {isSlideshow(wcmIdList) &&
                  <CaptionCreditSlideshow
                    captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                    creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                    extraStyles={[topperStyles.smallPaddingLeftWhenTablet]}
                  />
                }
                {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.smallPaddingLeftWhenTablet]} />}
              </figure>
            </div>
          </>
        );

      case "small-visual":
        return (
          <>
            <div>
              <figure className={`mw-xl ml-auto mr-auto ${topperStyles.imageSmallVisual}`}>
                {getMediaHTML(isSlideshow(wcmIdList))}
              </figure>
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

      case "side-by-side":
        let figureCss = isSlideshow(wcmIdList) ? `${topperStyles.imageSideBySideSlideshow}` : `${topperStyles.imageSideBySide}`;
        let sideBySideContainerCss = (Inverted_Layout === "headerdek-right-image-left") ? `${topperStyles.topperContainerSideBySide} ${topperStyles.reverseFlexbox}` : `${topperStyles.topperContainerSideBySide}`;
        setBackgroundAndTextColor();
        return (
          <div className={sideBySideContainerCss}>
            <div className={headerDekStyleList().join(' ')}>
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
            <figure className={figureCss}>
              {getMediaHTML(isSlideshow(wcmIdList))}

              {isSlideshow(wcmIdList) &&
                <CaptionCreditSlideshow
                  captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                  creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                  extraStyles={[topperStyles.slideshowCaptionSideBySide, sideBySideCapCredColorCss(), sideBySideCapCredPaddingCss()]}
                  creditStyles={[sideBySideCapCredColorCss()]}
                />
              }
              {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.captionSideBySide, sideBySideCapCredColorCss()]} creditStyles={[sideBySideCapCredColorCss()]} />}
            </figure>
          </div>
        );

      case "side-by-side-portrait":
        let portraitFigureCss = isSlideshow(wcmIdList) ? `${topperStyles.imageSideBySidePortraitSlideshow}` : `${topperStyles.imageSideBySidePortrait}`;
        let sideBySidePortraitContainerCss = (Inverted_Layout === "headerdek-right-image-left") ? `${topperStyles.topperContainerSideBySidePortrait} ${topperStyles.reverseFlexbox}` : `${topperStyles.topperContainerSideBySidePortrait}`;
        setBackgroundAndTextColor();
        return (
          <div className={topperStyles.fullWidthContainer}>
            <div className={sideBySidePortraitContainerCss}>
              <div className={headerDekStyleList().join(' ')}>
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
              <figure className={portraitFigureCss}>
                {getMediaHTML(isSlideshow(wcmIdList))}

                {isSlideshow(wcmIdList) &&
                  <CaptionCreditSlideshow
                    captionList={convertStringToList(Image_Caption, wcmIdList.length)}
                    creditList={convertStringToList(Image_Credits, wcmIdList.length)}
                    extraStyles={[topperStyles.slideshowCaptionSideBySidePortrait, sideBySideCapCredColorCss(), sideBySidePortraitCapCredPaddingCss()]}
                    creditStyles={[sideBySideCapCredColorCss()]}
                  />
                }
                {!isSlideshow(wcmIdList) && <CaptionCredit caption={Image_Caption} credit={Image_Credits} extraStyles={[topperStyles.captionSideBySidePortrait, sideBySideCapCredColorCss(), sideBySidePortraitFloatCss()]} creditStyles={[sideBySideCapCredColorCss()]} />}
              </figure>
            </div>
          </div>
        );
    }
  }

  /** Calculate offsets for header-deck container based on the spreadsheet, for full-screen toppers only **/
  const calculatefullScreenOffsets = () => {
    let verticalOffset = convertStringToNumber(HeaderDek_Vertical_Offset, (HeaderDek_Vertical_Position === "bottom"));
    let horizontalOffset = convertStringToNumber(HeaderDek_Horizontal_Offset, (HeaderDek_Horizontal_Position === "right"));

    if (r) {
      r.style.setProperty('--headerDek-vertical-offset', verticalOffset + "px");
      r.style.setProperty('--headerDek-horizontal-offset', horizontalOffset + "px");
    }
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

  /** Sets the background and text color in topper for side-by-side and side-by-side-portrait topper styles **/
  const setBackgroundAndTextColor = () => {
    if (r && Topper_Background_Color) {
      r.style.setProperty('--container-background-color', Topper_Background_Color)
    }

    if (r && Inverted_Text_Color) {
      r.style.setProperty('--side-by-side-text-color', Inverted_Text_Color)
    }
  }

  return (
    <TopperHtml />
  )
}

export default Topper2