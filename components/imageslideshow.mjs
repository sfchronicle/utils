import React, { useEffect, useState, useRef } from "react"
import TopperImage from "./topperimage.mjs"
import * as styles from "../styles/modules/imageslideshow.module.less"
import * as imageStyles from "../styles/modules/topperimage.module.less"
import { TransitionGroup, CSSTransition } from "react-transition-group"

const CurrentImage = ({ wcmId, wcmData, classList }) => {
  return (
    <div className={classList}>
      <TopperImage wcm={wcmId} alt={"test alt"} wcmData={wcmData} isFullScreenTopper={false} overrideCss={[imageStyles.cForceAspectRatio]}/>
    </div>
  )
}

const ImageSlideshow = ({ wcmData, imageList }) => {
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
      5000 // delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className={styles.container}>
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
          <CurrentImage wcmId={imageList[index]} wcmData={wcmData} classList={styles.currImage} />
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default ImageSlideshow