import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { setRichieParam } from '../sfc/component-helpers/utilfunctions'

// Add SFC utils
import { appCheck } from '../../../../index'

// withinProject: enable to get the benefits of Gatsby's speed loading for pages on the same project structure
// withinSite: disable if this is a link to an outside resource, like a government site or document
// you can assign other link-related attributes to this component, they'll transfer using the spread operator

const SafeLink = ({
  href,
  onClick,
  withinProject = false,
  withinSite = true,
  children,
  ...other
}) => {
  // Track what the link should be
  let [linkURL, setLinkURL] = useState(href)

  // Check on first load if this is in the app or not
  useEffect(() => {
    const isApp = appCheck()
    if (isApp) {
      setLinkURL(setRichieParam(href))
    }
  }, [])

  // Handle anchor tags for the app
  const interceptClick = (e, onClick) => {
    e.preventDefault()
    const scrollEl = document.getElementById(href.substring(1))
    if (scrollEl) {
      scrollEl.scrollIntoView()
    }

    // Preserve and run any original on click functionality
    if (onClick) {
      onClick()
    }
  }

  // If we detect an anchor tag, sub in behavior
  let clickFunc = onClick
  if (href.charAt(0) === '#') {
    clickFunc = interceptClick
  }
  // If we have no function, add a dummy one so we don't error
  if (!clickFunc){
    clickFunc = () => {}
  }

  return (
    <Fragment>
      {withinProject ? (
        <Link to={linkURL} onClick={(e) => clickFunc(e, onClick)} {...other}>
          {children}
        </Link>
      ) : (
        <a
          href={linkURL}
          target={withinSite ? '_self' : '_blank'}
          rel={withinSite ? null : 'noreferrer'}
          onClick={(e) => {
            if (clickFunc){
              clickFunc(e, onClick)
            }   
          }}
          {...other}
        >
          {children}
        </a>
      )}
    </Fragment>
  )
}

SafeLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default SafeLink
