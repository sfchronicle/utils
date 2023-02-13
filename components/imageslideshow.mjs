import React, { useEffect, useState, useRef } from "react"
import TopperImage from "./topperimage.mjs"
import * as styles from "../styles/modules/imageslideshow.module.less"
import * as imageStyles from "../styles/modules/topperimage.module.less"
import { TransitionGroup, CSSTransition } from "react-transition-group"

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
      // Set current image index
      setIndex((prevIndex) => (prevIndex === imageList.length - 1) ? 0 : prevIndex + 1);
    },
      4000 // Delay for switching images
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  const getContainerClass = () => {
    switch (topperStyle) {
      case "stacked":
        return styles.containerStacked;
      case "full-screen":
        return styles.containerStacked;
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
            {/* TODO: fix alt and captions */}
            <TopperImage wcm={imageList[index]} alt={"test alt"} wcmData={wcmData} overrideCssList={getImageClassList()} />
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default ImageSlideshow