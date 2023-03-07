import React from 'react'

import { Helmet } from 'react-helmet'
import { appCheck, getBrands2 } from "../../index"

const LayoutHelmet = ({ meta, url_add }) => {
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

  const isApp = appCheck()
  const thisBrand = getBrands2(MARKET_KEY);

  // Get stylesheet id from market key
  let styleSheetID
  if ((MARKET_KEY === "SFC") || (MARKET_KEY === "Houston") || (MARKET_KEY === "Albany")) {
    styleSheetID = MARKET_KEY
  }
  else {
    styleSheetID = "default"
  }

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

  return (
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link
        rel="shortcut icon"
        href="/favicon.ico"
        type="image/x-icon"
      />
      <link rel="canonical" href={`${CANONICAL_URL}/${url_add}`} />
      <link rel="stylesheet" href={`https://files.sfchronicle.com/brand-styles/${styleSheetID}.css`} />
      <link rel="stylesheet" href={`https://files.sfchronicle.com/brand-styles/reset.css`} />


      {(isApp || EMBEDDED) ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="max-image-preview:large" />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SOCIAL_TITLE} />
      <meta name="twitter:site" content={"@" + thisBrand.attributes.twitter} />
      <meta
        name="twitter:url"
        content={`${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}`}
      />
      <meta name="twitter:image" content={IMAGE} />
      <meta name="twitter:description" content={DESCRIPTION} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={SOCIAL_TITLE} />
      <meta property="og:site_name" content={thisBrand.attributes.siteName} />
      <meta property="og:url" content={`${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}`} />
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
  )
}

export default LayoutHelmet