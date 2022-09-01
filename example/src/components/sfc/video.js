import React from 'react'
import PropTypes from 'prop-types'
import videoStyles from '../../styles/modules/video.module.less'

export default function Video({
  id,
  containerClass,
  innerContainerClass,
  videoClass,
  autoPlay = true,
  loop = true,
  muted = true,
  alt,
  cap,
  cred,
}) {
  return (
    <figure className={containerClass ? containerClass : videoStyles.container}>
      <div
        className={
          innerContainerClass
            ? innerContainerClass
            : innerContainerClass === null
            ? ''
            : videoStyles.responsiveContainer
        }
      >
        <video
          className={videoClass ? videoClass : videoStyles.default}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload="auto"
          alt={alt}
          poster={`https://files.sfchronicle.com/static-assets/compression-bot/${id}.jpg`}
        >
          <source
            src={`https://files.sfchronicle.com/static-assets/compression-bot/${id}.mp4`}
            type="video/mp4"
          />
          <source
            src={`https://files.sfchronicle.com/static-assets/compression-bot/${id}.m3u8`}
            type="application/x-mpegURL"
          />
        </video>
      </div>
      {cap && cred && (
        <figcaption className={videoStyles.cFigCap}>
          {cap} <span className={videoStyles.cFigCred}>{cred}</span>
        </figcaption>
      )}
      {!cap && cred && (
        <figcaption className={videoStyles.cFigCap}>
          <span className={videoStyles.cFigCred}>{cred}</span>
        </figcaption>
      )}
      {cap && !cred && (
        <figcaption className={videoStyles.cFigCap}>{cap}</figcaption>
      )}
    </figure>
  )
}

Video.propTypes = {
  id: PropTypes.string.isRequired,
  videoClass: PropTypes.string,
  containerClass: PropTypes.string,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  alt: PropTypes.string.isRequired,
  cred: PropTypes.string,
  cap: PropTypes.string,
}
