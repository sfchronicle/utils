import React, { useEffect, useState, useRef } from "react"
import TopperImage from "../topperimage.mjs"
import * as styles from "../../styles/modules/imageslideshow.module.less"
import * as imageStyles from "../../styles/modules/topperimage.module.less"
import { TransitionGroup, CSSTransition } from "react-transition-group"

const ImageSlideshow = ({ wcmData, imageList, altList, topperStyle, isLayoutInverted = false }) => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      // Set current image index
      setIndex((prevIndex) => (prevIndex === imageList.length - 1) ? 0 : prevIndex + 1);
    },
      4000 // Delay for switching images
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  useEffect(() => {
    // Find the max height ratio within an wcm image list, this is only used for the small visual slideshow
    if (wcmData.nodes) {
      let ratioList = wcmData.nodes.map((d) => d.photo.ratio)
      console.log(ratioList)
      let minRatio = Math.max(...ratioList)

      // During server-side rendering, access to ":root" is unavailable. This is okay; we just need
      // to make sure that the site does not crash during SSR
      let r = (typeof window != "undefined") ? document.querySelector(':root') : null;
      if (r) {
        r.style.setProperty('--small-visual-height-ratio', minRatio);
      }
    }
  }, [])

  const getContainerClass = () => {
    switch (topperStyle) {
      case "stacked":
        return styles.containerStacked;
      case "full-screen":
        return styles.containerFullscreen;
      case "small-visual":
        return styles.containerSmallVisual;
      default:
        return "";
    }
  }

  const getWrapperClass = () => {
    switch (topperStyle) {
      case "stacked":
        return styles.imageWrapperStacked;
      case "full-screen":
        return styles.imageWrapperFullscreen;
      case "side-by-side":
        return styles.imageWrapperSideBySide;
      case "side-by-side-portrait":
        return styles.imageWrapperSideBySidePortrait;
      case "small-visual":
        return styles.imageWrapperSmallVisual;
      default:
        return "";
    }
  }

  const getImageClassList = () => {
    switch (topperStyle) {
      case "stacked":
        return [imageStyles.cForceAspectRatio];
      case "full-screen":
        return [imageStyles.cImgSlideshowFullscreen];
      case "side-by-side":
        return [imageStyles.cImgSlideshowSideBySide].concat(
          // Add styling for left padding on topper image
          (isLayoutInverted) ? [imageStyles.cLargePaddingLeft] : [imageStyles.cLargePaddingRight]
        );
      case "side-by-side-portrait":
        return [imageStyles.cImgSlideshowSideBySidePortrait].concat(
          [
            // Add styling for left padding on image caption
            (isLayoutInverted) ? [] : [styles.sideBySidePortraitMarginLeft]
          ]
        );
      default:
        return [""];
    }
  }

  /**
   * Overall CSS architecture:
   * <Container>
   *   <Wrapper>
   *    <Image/>
   *  </Wrapper> 
   * </Container> 
   */
  return (
    <div className={getContainerClass()}>
      <TransitionGroup>
        <CSSTransition
          key={index}
          timeout={4000}
          classNames={{
            enter: styles.fadeEnter,
            enterActive: styles.fadeEnterActive,
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
            exitDone: styles.fadeExitDone
          }}
        >
          <div className={getWrapperClass()}>
            <TopperImage wcm={imageList[index]} alt={altList[index]} wcmData={wcmData} imageCssList={getImageClassList()} />
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default ImageSlideshow