import React from "react"

import {
  pubdateString,
  moddateString
} from './helpers/datehelpers.mjs'

const OgPubDate = ({ settings }) => {
  return (
    <>
      {moddateString && 
        <p><i>Originally published on {pubdateString}</i></p>
      }
    </>
  )
}

export default OgPubDate