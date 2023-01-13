import React, {useRef, useEffect, useLayoutEffect, useState} from 'react'
import PropTypes from 'prop-types'
import CaptionCredit from './captioncredit.mjs'
import * as wcmimageStyles from "../styles/modules/wcmimage2.module.less"
import { debounce } from './helpers/utilfunctions.mjs'

const currentEnv = process.env.GATSBY_DEPLOY_ENV

const ImageCss = [wcmimageStyles.cImg];

const ImageHTML = ({fullPath, imageRez, alt}) => {
  // TODO: remove style for full screen
  return (
    <img 
      style={{position: "absolute"}} 
      className={ImageCss.join(' ')} 
      src={`${fullPath}${imageRez}x0.jpg`} 
      alt={alt}/>
  )
}

const WCMImage = ({ wcm, alt, cap, cred, isNotLazyloaded, className, ratio, wcmData, lazyloader, isFullScreenTopper }) => {
  // When the wrapping div is rendered, we're going to figure out the best size for this image to be
  let picRef = useRef(null)
  let [imageRez, setImageRez] = useState(0)

  let setImageWidth = () => {
    let pixelWidth = 900 // Default width if we need a fallback
    let pixelRatio = window.devicePixelRatio || 1
    if (picRef.current && picRef.current.offsetWidth){
      pixelWidth = Math.round(picRef.current.offsetWidth * pixelRatio)
    }
    if (imageRez < pixelWidth){ // No need to resize if we're just scaling down
      setImageRez(pixelWidth)
    }
  }

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setImageWidth()
    }, 500)
    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  useEffect(() => {
    setImageWidth()
  }, [])

  // If this is actually undefined, return null
  // No error, nothing is rendered
  if (!wcm){
    return null
  }

  let photoRatio = "56.25%"; // Default to 16/9
  let fullPath = `https://s.hdnux.com/photos/0/0/0/${wcm}/0/`;
  if (!ratio){
    let matchedPhoto = wcmData.nodes.find((item) => {
        if ("id" in item) {
            return item.id.toString() === wcm.toString()
        } else {
            return item.photo.wcmid.toString() === wcm.toString()
        }
    })
    if (!matchedPhoto && currentEnv !== "development"){
      throw `WCMImage error: No matching ID for ${wcm} present in the array at the top of gatsby-node.js! If it's already there, you might need to reboot dev.`
    } 
    if (matchedPhoto){  
      // Set ratio of the actual photo like a legit hacker
      photoRatio = (matchedPhoto.photo.ratio*100)+"%";
      fullPath = matchedPhoto.photo.full_path;
    } else {
      // Alert that things will go wrong on deploy
      console.error(`No matching ID for ${wcm} found in gatsby-node.js! This is fine for development, but it will error on deploy!`);
    }
  } else {
    // If an override is being passed in, use that
    photoRatio = ratio
  }

  // Get serious about alt tags
  if (typeof alt !== "string"){
    throw `WCMImage error: Image for ${wcm} needs an alt tag! Please add a good, descriptive alt tag. Suggestion from Mozilla: When choosing alt strings for your images, imagine what you would say when reading the page to someone over the phone without mentioning that there's an image on the page.`
  }

  // Pull lazyloader HTML from index.js
  const LazyLoaderHTML = lazyloader;

  return (
      <figure className={className ? className : ""}>
        {/* TODO: remove style for full screen image  */}
        <div ref={picRef} style={{paddingBottom: photoRatio, overflow: "hidden", position: "relative"}}>
          {!isNotLazyloaded && (
            <LazyLoaderHTML>
              <ImageHTML fullPath={fullPath} imageRez={imageRez} alt={alt}/>
            </LazyLoaderHTML>
          )}
          {isNotLazyloaded && <ImageHTML fullPath={fullPath} imageRez={imageRez} alt={alt}/>}
        </div>
        <CaptionCredit caption={cap} credit={cred} isFullScreenTopper={isFullScreenTopper}/>
      </figure>
  )
}

WCMImage.propTypes = {
  wcm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  alt: PropTypes.string.isRequired,
  cap: PropTypes.string,
  cred: PropTypes.string,
  isLazyloaded: PropTypes.bool,
  className: PropTypes.string,
  ratio: PropTypes.string,
  lazyloader: PropTypes.element
}

export default WCMImage