import React from 'react'
import { Helmet } from "react-helmet"
import { getFigureWidth } from './helpers/utilfunctions.mjs'

const Datawrapper = ({ altText, id, height, figureWidth = 'text-width' }) => {

  const url = `https://datawrapper.dwcdn.net/${id}`
  const nu_id = `datawrapper-chart-${id}`

  // width options: float-left, float-right, text-width, large, wide, full
  const width = getFigureWidth(figureWidth);

  return (
    <>
      {/* responsive DW script */}
      <Helmet>
        <script
          type="text/javascript"
          src="https://datawrapper.dwcdn.net/lib/embed.min.js"
        ></script>
      </Helmet>
      <div className={`iframe_Container graphic-wrapper inline-figure ${width}`}>
        <figure>
          <iframe title={altText} aria-label={altText} id={nu_id} src={url} scrolling="no" frameborder="0" style={{ width: 0, minWidth: "100%", border: "none" }} height={height}></iframe>
        </figure>
      </div>
    </>
  )
}

export default Datawrapper