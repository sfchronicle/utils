import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Headroom from 'react-headroom'
import { getNav, appCheck } from '../../../../index'
import * as navStyles from '../../styles/nav.less'
import { setRichieParam } from './component-helpers/utilfunctions'
let projectConfig;
let navUrl;
let navText;
try {
	projectConfig = require("../../project-config.json")
  navUrl = projectConfig[0].NavLink
  navText = projectConfig[0].NavTitle
} catch (err){
  // do nothing
}

if (projectConfig){
  // Conditional logic/rendering goes here
}
const NavTop = ({ meta, url_add = '' }) => {
  let [showSubnav, setShowSubnav] = useState(false)
  let [navClass, setNavClass] = useState("")

  /* 
  getNav params:
    1. meta 
    2. url_add 
    3. force color ("white", "black" or null)
    4. navlink object {
        text,
        url,
        target
      }
    5. array of link objects for subnav 
    6. if true, show subscribe button instead of share buttons
  */

  // Override these with link objects (example below) if you want to customize
  let navLink
  if(navUrl || navText){
  navLink = {
    url: navUrl,
    text: navText,
    target: "_self",
  };
}
  let sectionArray = null

  // Enable the social popup
  let handleNavClick = (e) => {
    // Handle facebook
    let el = e.target.closest("#topper-nav-facebook-icon");
    if (el && e.currentTarget.contains(el)) {
      const link = el.getAttribute("href");
      e.preventDefault()
      window.open(
        link,
        'facebook-share-dialog',
        'width=626,height=436'
      )
    }
    // Handle subnav (but only if there are nav items)
    if (sectionArray && sectionArray.length > 0){
      el = e.target.closest("#nav-title");
      if (el && e.currentTarget.contains(el)) {
        e.preventDefault()
        setShowSubnav(!showSubnav)
      }
      // Handle closing subnav
      el = e.target.closest("#subnav");
      if (el && e.currentTarget.contains(el)) {
        setShowSubnav(false)
      }
    }
  }
  
  //If this is CT, we need to reset state
  let startingHTML = "";
  if (meta.PROJECT.MARKET_KEY !== "CT"){
    startingHTML = getNav(meta, url_add, null, navLink, sectionArray)
  }
  let [navHTML, setNavHTML] = useState(startingHTML)

  // Setting nav now so that other CT markets can generate
  useEffect(() => {
    sectionArray = setRichieParam(sectionArray)
    setNavHTML(getNav(meta, url_add, null, navLink, sectionArray))

    // Set the navClass
    let tempNavClass = ""
    if (showSubnav){
      tempNavClass += " show-subnav"
    }
    if (!appCheck()){
      tempNavClass += " not-app"
    }
    setNavClass(tempNavClass)
  }, [])

  return (
    <Headroom
      style={{
        zIndex: '2147483647',
      }}
    >
      <div className={navClass}
        onClick={(e) => {handleNavClick(e)}} 
        dangerouslySetInnerHTML={{__html: navHTML}} 
      />
    </Headroom>
  )
}

NavTop.propTypes = {
  meta: PropTypes.object.isRequired,
  url_add: PropTypes.string,
}

export default NavTop

