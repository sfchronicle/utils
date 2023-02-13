import React, { useEffect, useState, useRef } from "react"
import TopperImage from "./topperimage.mjs"
import * as styles from "../styles/modules/imageslideshow.module.less"
import * as imageStyles from "../styles/modules/topperimage.module.less"
import { TransitionGroup, CSSTransition } from "react-transition-group"

const CurrentImage = ({ wcmId, wcmData, topperStyle }) => {
  let wrapperClass = "";
  switch (topperStyle) {
    case "stacked": 
      wrapperClass = styles.imageWrapperStacked;
      break;
    default:
      wrapperClass = styles.imageWrapperFullscreen;
      break;
  }
  
  let imageCss = [""];
  switch (topperStyle) {
    case "stacked": 
      imageCss = [imageStyles.cForceAspectRatio];
      break;
    case "full-screen":
      imageCss = [imageStyles.cImgSlideshowFullscreen];
      break;
    default:
      break;
  }

  return (
    <div className={wrapperClass}>
      <TopperImage wcm={wcmId} alt={"test alt"} wcmData={wcmData} isFullScreenTopper={false} overrideCssList={imageCss}/>
    </div>
  )
}

const ImageSlideshow = ({ wcmData, imageList, topperStyle }) => {
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
      // Set image index
      setIndex((prevIndex) => (prevIndex === imageList.length - 1) ? 0 : prevIndex + 1);
    },
      4000 // delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  // TODO turn into function
  let containerClass = "";
  switch (topperStyle) {
    case "stacked": 
      containerClass = styles.containerStacked;
      break;
    case "full-screen": 
      containerClass = styles.containerStacked;
      break;
    default: 
      break;
  }

  return (
    <div className={containerClass}>
      <TransitionGroup>
        <CSSTransition
          key={index}
          timeout={40000}
          classNames={{
            enter: styles.fadeEnter,
            enterActive: styles.fadeEnterActive,
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
            exitDone: styles.fadeExitDone
          }}
        >
          <CurrentImage wcmId={imageList[index]} wcmData={wcmData} topperStyle={topperStyle}/>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default ImageSlideshow