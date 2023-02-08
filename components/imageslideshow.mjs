import React, { useEffect, useState, useRef }  from "react"
import TopperImage from "./topperimage.mjs"
import * as styles from "../styles/modules/imageslideshow.module.less"


const CurrentImage = ({ wcmId, wcmData, classList }) => {
  return (
    <div className={classList}>
      <TopperImage wcm={wcmId} alt={"test alt"} wcmData={wcmData} isFullScreenTopper={false}/>
    </div>
  )
}

const ImageSlideshow = ({ wcmData, imageList }) => { 
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(imageList.length-1);

  const timeoutRef = useRef(null);
  const [animClass, setAnimClass] = useState(styles.test);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setAnimClass(styles.fadein);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setTimeout(() => {
        setAnimClass("");
        setPrevIndex((index > 0) ? (index - 1) : (imageList.length - 1));
      }, 3500);

      
      // const newspaper = document.querySelector("."+animClass);
      // const newspaperSpinning = [
      //   { transform: 'rotate(360deg) scale(0)' }
      // ];
      
      // const newspaperTiming = {
      //   duration: 2000,
      //   iterations: 1,
      // }

      // if (newspaper != null) {
      //   console.log("test")
      //   newspaper.addEventListener('load', () => {
      //     newspaper.animate(newspaperSpinning, newspaperTiming);
      //   });
      // }

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
    <div className={styles.slideshow}> 
      <div className={styles.container}>
        {/* <CurrentImage wcmId={imageList[prevIndex]} wcmData={wcmData} classList={styles.grid}/> */}
        <CurrentImage wcmId={imageList[index]} wcmData={wcmData} classList={animClass}/>
      </div>
    </div>
  )
}

export default ImageSlideshow