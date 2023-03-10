import React from "react"

import {
  pubdateString,
  moddateString
} from './helpers/datehelpers.mjs'

const OgPubDate = () => {
  return (
    <>
      {moddateString && 
        <p className="mt-md og-pub-date">Originally published on {pubdateString}</p>
      }    
    </>
  )
}

export default OgPubDate