import React, {useRef, useEffect, useLayoutEffect, useState} from 'react'
import LazyLoad from 'react-lazyload'
import PropTypes from 'prop-types'
import * as wcmimageStyles from "../css/wcmimage.module.less"
import { useStaticQuery, graphql } from "gatsby"
import { debounce } from './helpers/utilfunctions.mjs'

const currentEnv = process.env.GATSBY_DEPLOY_ENV

const WCMImage = ({ wcm, alt, cap, cred, lz, className, ratio }) => {
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

  // Use GraphQL to grab the data for the WCM photo we want
  const data = useStaticQuery(graphql`
    query PhotoQuery {
      allWcmPhotos {
        nodes {
          photo {
            ratio
            wcmid
            full_path
          }
        }
      }
    }
  `)

  let photoRatio = "56.25%"; // Default to 16/9
  let fullPath = `https://s.hdnux.com/photos/0/0/0/${wcm}/0/`;
  if (!ratio){
    let matchedPhoto = data.allWcmPhotos.nodes.find((item) => {
      return item.photo.wcmid.toString() === wcm.toString()
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

  // Conditionally lazyload if we want to and have the capability
  const ConditionalWrapper = ({ condition, wrapper, children }) => 
  condition ? wrapper(children) : children;

  return (
    <figure className={className ? className : ""}>
      <div ref={picRef} style={{paddingBottom: photoRatio, overflow: "hidden", position: "relative"}}>
        <ConditionalWrapper
          condition={!lz}
          wrapper={children => <LazyLoad offset={300} resize once>{children}</LazyLoad>}
        >
          {imageRez > 0 &&
            <img style={{position: "absolute"}}
              className={wcmimageStyles.cImg}
              // "lazy" won't work on older browsers, which is why we use LazyLoad conditionally
              loading="lazy"
              src={`${fullPath}${imageRez}x0.jpg`}
              // PLEASE INCLUDE ALTS
              alt={alt}
            />
          }
        </ConditionalWrapper>
      </div>
      {cap && cred && (
        <figcaption className={wcmimageStyles.cFigCap}>
          {cap} <span className={wcmimageStyles.cFigCred}>{cred}</span>
        </figcaption>
      )}
      {!cap && cred && (
        <figcaption className={wcmimageStyles.cFigCap}>
          <span className={wcmimageStyles.cFigCred}>{cred}</span>
        </figcaption>
      )}
      {cap && !cred && (
        <figcaption className={wcmimageStyles.cFigCap}>{cap}</figcaption>
      )}
    </figure>
  )
}

WCMImage.propTypes = {
  wcm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  // alt: PropTypes.string.isRequired,
  cap: PropTypes.string,
  cred: PropTypes.string,
  className: PropTypes.string,
}

export default WCMImage
