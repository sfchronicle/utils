import React, {useState, useEffect} from 'react'
import { getFooter } from '../../../../index'
// simple scroll-to function package https://github.com/callmecavs/jump.js
import jump from 'jump.js'
import * as navStyles from '../../styles/footer.less'


const Footer = ({meta}) => {
  //If this is CT, Texcom, or Midcom, we need to reset state
  let startingHTML = "";
  if (['Texcom','Midcom','CT'].indexOf(meta.PROJECT.MARKET_KEY) === -1) {
    startingHTML = getFooter(meta, true)
  }
  let [footerHTML, setFooterHTML] = useState(startingHTML)

  // grabs footer return to top button and makes it jump to top on click
  useEffect(() => {
    let footerTopButton = document.querySelector('#scrollTop')
    if (footerTopButton){
      footerTopButton.onclick = () => jump('#___gatsby', { a11y: true })
    }

    setFooterHTML(getFooter(meta, true))
  }, [])

  return (
    /* 
    getFooter params:
      1. meta 
      2. invert colors (boolean)
    */
    <div dangerouslySetInnerHTML={{__html: footerHTML}} />
  )
}

export default Footer
