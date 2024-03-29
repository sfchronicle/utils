import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as wcmimageStyles from "../styles/modules/topperimage.module.less"
import { debounce } from './helpers/utilfunctions.mjs'

const currentEnv = process.env.GATSBY_DEPLOY_ENV

const ImageHTML = ({ fullPath, imageRez, alt, imageCssList }) => {
  let imageCss = [wcmimageStyles.cImg];
  if (imageCssList) imageCss = imageCssList

  return (
    <img
      className={imageCss.join(' ')}
      src={`${fullPath}${imageRez}x0.jpg`}
      alt={alt} />
  )
}

const TopperImage = ({ wcm, alt, ratio, wcmData, containerCssList = [], imageCssList = [] }) => {
  // When the wrapping div is rendered, we're going to figure out the best size for this image to be
  let picRef = useRef(null)
  let [imageRez, setImageRez] = useState(0)

  let setImageWidth = () => {
    let pixelWidth = 900 // Default width if we need a fallback
    let pixelRatio = window.devicePixelRatio || 1
    if (picRef.current && picRef.current.offsetWidth) {
      pixelWidth = Math.round(picRef.current.offsetWidth * pixelRatio)
    }
    if (imageRez < pixelWidth) { // No need to resize if we're just scaling down
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
  if (!wcm) {
    return null
  }

  // During server-side rendering, access to ":root" is unavailable. This is okay; we just need
  // to make sure that the site does not crash during SSR
  let r = (typeof window != "undefined") ? document.querySelector(':root') : null;

  // This calculation is not used for the topper impl, but keeping it here just in case
  // it is needed for the general WCMImage utils migration
  let photoRatio = "56.25%"; // Default to 16/9
  let photoFraction = 0.5625;
  let photoViewport = "56.25vw";
  let fullPath = `https://s.hdnux.com/photos/0/0/0/${wcm}/1/`;
  if (!ratio) {
    let matchedPhoto = wcmData.nodes.find((item) => {
      return (item.photo.wcmid).toString() === (wcm).toString()
    })
    if (!matchedPhoto && currentEnv !== "development") {
      throw `WCMImage error: No matching ID for ${wcm} present in the array at the top of gatsby-node.js! If it's already there, you might need to reboot dev.`
    }
    if (matchedPhoto) {
      // Set ratio of the actual photo like a legit hacker
      photoRatio = (matchedPhoto.photo.ratio * 100) + "%";
      photoViewport = (matchedPhoto.photo.ratio * 50) + "vw";
      photoFraction = (parseFloat(matchedPhoto.photo.ratio));

      // If css :root is available, set the photo ratio
      if (r) {
        r.style.setProperty('--img-bottom-padding-ratio', photoRatio);
        r.style.setProperty('--img-height-viewport', photoViewport);
        r.style.setProperty('--img-bottom-padding-fraction', photoFraction);
      }

      fullPath = matchedPhoto.photo.full_path;
    } else {
      // Alert that things will go wrong on deploy
      console.error(`No matching ID for ${wcm} found in gatsby-node.js! This is fine for development, but it will error on deploy!`);
    }
  } else {
    // If an override is being passed in, use that
    photoRatio = ratio

    // If css :root is available, set the photo ratio
    if (r) {
      r.style.setProperty('--img-bottom-padding-ratio', photoRatio);
      r.style.setProperty('--img-height-viewport', photoViewport);
      r.style.setProperty('--img-bottom-padding-fraction', photoFraction);
    }
  }

  // Get serious about alt tags
  if (typeof alt !== "string") {
    throw `WCMImage error: Image for ${wcm} needs an alt tag! Please add a good, descriptive alt tag. Suggestion from Mozilla: When choosing alt strings for your images, imagine what you would say when reading the page to someone over the phone without mentioning that there's an image on the page.`
  }

  return (
    <div className={containerCssList.join(' ')} ref={picRef}>
      {imageRez > 0 &&
        <ImageHTML fullPath={fullPath} imageRez={imageRez} alt={alt} imageCssList={imageCssList} />
      }
    </div>
  )
}

TopperImage.propTypes = {
  wcm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  alt: PropTypes.string.isRequired,
  ratio: PropTypes.string, 
  wcmData: PropTypes.object,
  containerCssList: PropTypes.array,
  imageCssList: PropTypes.array
}

export default TopperImage