/* Layout wraps all pages so updates here effect everything */

import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import LayoutHelmet from '../../../components/layouthelmet.mjs'
import Footer from './sfc/footer'
// Add SFC utils
import { appCheck } from '../../../index'
import { appendLayoutScripts, formatHDN } from "../../../components/helpers/utilfunctions.mjs"
// Import global styles needed in document
require('../styles/seed.less')

const Layout = ({
  meta,
  url_add = '',
  description = false,
  image = false,
  social_title = false,
  title = false,
  embed = false,
  children,
}) => {
  // Determine if we need registration code

  let {
    EMBEDDED,
    PROJECT: {
      DESCRIPTION,
      IMAGE,
      SOCIAL_TITLE,
      TITLE
    },
  } = meta

  // Override these if they exist (but just use the default otherwise)
  meta.PROJECT.DESCRIPTION = description || DESCRIPTION
  meta.PROJECT.IMAGE = image || IMAGE
  meta.PROJECT.SOCIAL_TITLE = social_title || SOCIAL_TITLE
  meta.PROJECT.TITLE = title || TITLE

  // If we're receiving `embed` as a prop, change this page's settings to be embed settings
  if (embed) {
    meta.EMBEDDED = true
  }

  // Make sure url_add ends with a slash
  if (url_add && url_add.slice(-1) !== "/") {
    url_add += "/"
  }

  // Determine if app ver
  // Either from the build settings or from the query string
  const isApp = appCheck()

  // Combine our settings with what Hearst puts on page
  let stringHDN = formatHDN(EMBEDDED, url_add, meta);

  useEffect(() => {
    appendLayoutScripts(EMBEDDED);
  }, [])

  return (
    <Fragment>
      {/* Forcing HDN vars in so we can feed them to ensighten */}
      <Helmet
        script={[
          {
            type: 'text/javascript',
            innerHTML: stringHDN,
          },
        ]}
      />

      <LayoutHelmet meta={meta} url_add={url_add}/>

      {/* Full project included here: */}
      {children}

      {/* Include footer unless it's embedded or the app version: */}
      {!EMBEDDED && !isApp && <Footer meta={meta} />}
    </Fragment>
  )
}

Layout.propTypes = {
  meta: PropTypes.object.isRequired,
  url_add: PropTypes.string,
  children: PropTypes.node.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  social_title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
}

export default Layout
