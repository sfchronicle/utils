/* Layout wraps all pages so updates here effect everything */

import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// Bring in footer
import Footer from './sfc/footer'

// Add SFC utils
import { blendHDN, appCheck, getBrands, getBlueconic } from '../../../index'

// Import global styles needed in document
require('../styles/seed.less')

const Layout = ({   
  meta,
  url_add = '',
  description = false,
  image = false,
  social_title = false,
  title = false,
  children, 
}) => {
  // Determine if we need registration code

  let {
    EMBEDDED,
    MAIN_DOMAIN,
    PROJECT: {
      AUTHORS,
      DESCRIPTION,
      IMAGE,
      ISO_MODDATE,
      ISO_PUBDATE,
      OPT_SLASH,
      SLUG,
      SOCIAL_TITLE,
      SUBFOLDER,
      TITLE,
      MARKET_KEY,
      CANONICAL_URL
    },
  } = meta

  // Override these if they exist (but just use the default otherwise)
  DESCRIPTION = description || DESCRIPTION
  IMAGE = image || IMAGE
  SOCIAL_TITLE = social_title || SOCIAL_TITLE
  TITLE = title || TITLE

  let styleSheetID;
  if ((MARKET_KEY === "SFC") || (MARKET_KEY === "Houston") || (MARKET_KEY === "Albany")) {
    styleSheetID = MARKET_KEY
  }
  else {
    styleSheetID = "default"
  }

  // Make sure url_add ends with a slash
  if (url_add && url_add.slice(-1) !== "/"){
    url_add += "/"
  }

  // Determine if app ver
  // Either from the build settings or from the query string
  const isApp = appCheck()

  // Combine our settings with what Hearst puts on page
  let stringHDN = ''
  if (!EMBEDDED) {
    // Put url_add into a new meta object to pass in
    const metaHDN = Object.assign({}, meta)
    metaHDN.URL_ADD = url_add
    // Make sure this is free on app
    if (isApp){
      metaHDN.PAYWALL_SETTING = "free";
    }
    let blended = blendHDN(metaHDN)
    stringHDN = blended.stringHDN
  }

  // Get brand vars
  const thisBrand = getBrands(MARKET_KEY);

  // Handle author data
  let authorObj = []
  let newAuthor = {}
  try {
    AUTHORS.forEach(author => {
      newAuthor = {
        '@type': 'Person',
        name: author.AUTHOR_NAME,
        url: author.AUTHOR_PAGE,
      }
      authorObj.push(newAuthor)
    })
  } catch (err) {
    // If it errored, just set to neutral default
    authorObj = {
      '@type': 'Person',
      name: thisBrand.attributes.siteName,
      url: MAIN_DOMAIN,
    }
  }

  useEffect(() => {
    // React Helmet is actually terrible and runs these scripts twice, so we are including them async ourselves
    // Run analytics and resizing scripts right away so we take care of that
    if (!EMBEDDED){
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://nexus.ensighten.com/hearst/news/Bootstrap.js';
      document.body.appendChild(script);
    } else {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://projects.sfchronicle.com/shared/js/responsive-child.js';
      document.body.appendChild(script);
    }

    if (!EMBEDDED && !isApp){
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'adPositionManagerScriptTag';
      script.src = 'https://aps.hearstnp.com/Scripts/loadAds.js';
      document.body.appendChild(script);
    }

    // Wait a beat, then add to body so it doesn't mess with the head (which Helmet seems to want to manage)
    setTimeout(() => {
      if (!EMBEDDED && !isApp){
        let blueconicURL = getBlueconic(window.location.origin)
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.src = blueconicURL;
        document.body.appendChild(script);
      }
    }, 5000)
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
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
        <link rel="canonical" href={ CANONICAL_URL } />
        <link rel="stylesheet" href={`https://files.sfchronicle.com/brand-styles/${styleSheetID}.css`} />

        {(isApp || EMBEDDED) ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="max-image-preview:large" />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SOCIAL_TITLE} />
        <meta name="twitter:site" content={"@"+thisBrand.attributes.twitter} />
        <meta
          name="twitter:url"
          content={`${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}`}
        />
        <meta name="twitter:image" content={IMAGE} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={SOCIAL_TITLE} />
        <meta property="og:site_name" content={thisBrand.attributes.siteName} />
        <meta property="og:url" content={`${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}`}/>
        <meta property="og:image" content={IMAGE} />
        <meta property="og:description" content={DESCRIPTION} />

        <script data-schema="NewsArticle" type="application/ld+json">{`{
          "@context": "http://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}"
          },
          "headline": "${TITLE}",
          "image": {
            "@type": "ImageObject",
            "url": "${IMAGE}"
          },
          "datePublished": "${ISO_PUBDATE}",
          "dateModified": "${ISO_MODDATE}",
          "author": ${JSON.stringify(authorObj)},
          "publisher": {
            "@type": "Organization",
            "name": "${thisBrand.attributes.siteName}",
            "logo": {
              "@type": "ImageObject",
              "url": "/apple-touch-icon.png",
              "width": "180",
              "height": "180"
            }
          },
          "description": "${DESCRIPTION}"
        }`}</script>
      </Helmet>

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
