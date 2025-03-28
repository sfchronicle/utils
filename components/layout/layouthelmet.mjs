import React from "react";

import { Helmet } from "react-helmet";
import { appCheck, getBrands2, getBrands3 } from "../../index";

const LayoutHelmet = ({
  meta,
  url_add,
  noindex = false,
  schemaOverride = {},
  brandsVer = 2,
}) => {
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
      CANONICAL_URL,
      ANALYTICS_CREDIT,
      SECTION,
    },
  } = meta;

  // Update to handle escaping double quotes
  const schemaTitle = TITLE ? TITLE.replace(/"/g, '\\"') : "";
  const schemaDescription = DESCRIPTION ? DESCRIPTION.replace(/"/g, '\\"') : "";

  // Handle style sheet on brands2 vs brands3
  const isApp = appCheck();
  let styleSheetID;
  let thisBrand;
  if (brandsVer === 2) {
    thisBrand = getBrands2(MARKET_KEY);
    if (
      MARKET_KEY === "SFC" ||
      MARKET_KEY === "Houston" ||
      MARKET_KEY === "Albany"
    ) {
      styleSheetID = MARKET_KEY;
    } else {
      styleSheetID = "default";
    }
  } else {
    thisBrand = getBrands3(MARKET_KEY);
    if (MARKET_KEY === "SFC") {
      styleSheetID = "plat-styles/" + MARKET_KEY;
    } else {
      styleSheetID = "plat-styles/default";
    }
  }

  // Handle author data
  let authorObj = [];
  let newAuthor = {};
  try {
    if (!ANALYTICS_CREDIT) {
      // If we have authors (not analytics credit), use those
      AUTHORS.forEach((author) => {
        newAuthor = {
          "@type": "Person",
          name: author.AUTHOR_NAME,
          url: author.AUTHOR_PAGE,
        };
        authorObj.push(newAuthor);
      });
    } else {
      // If we have analytics credit, use that
      const creditList = ANALYTICS_CREDIT.split(",");
      creditList.forEach((credit) => {
        newAuthor = {
          "@type": "Person",
          name: credit,
          url: MAIN_DOMAIN, // Not ideal to not have the actual author page, but we don't have it
        };
        authorObj.push(newAuthor);
      });
    }
  } catch (err) {
    // If it errored, just set to neutral default
    authorObj = {
      "@type": "Person",
      name: thisBrand.attributes.siteName,
      url: MAIN_DOMAIN,
    };
  }

  // Handle special favicon logic
  // NOTE: We considered storing our OWN favicons in S3, but Evan decided not to do that because we DON'T know the URL's domain at this point :( which means we'd need to detect it when the page loads (to support CT/Texcom/Midcom) and that might be too late for the page to use it
  let favHref = "/favicon.ico";
  if (MARKET_KEY === "TK") {
    favHref = "https://files.sfchronicle.com/devhub-logos/DHlogos-sm.png";
  } else if (MARKET_KEY === "Seattle") {
    favHref =
      "https://www.seattlepi.com/sites/seattlepi/apple-touch-icon-196x196.png";
  } else if (MARKET_KEY === "SFC") {
    favHref =
      "https://www.sfchronicle.com/sites/premiumsfgate/favicon-32x32.png";
  } else if (MARKET_KEY === "Houston") {
    // NOTE: HC is cursed with a tiny favicon until product can fix the higher res one
    favHref =
      "https://www.houstonchronicle.com/sites/premiumchron/favicon-32x32.png";
  } else if (MARKET_KEY === "SanAntonio") {
    // NOTE: EN is cursed with a tiny favicon until product can fix the higher res one
    favHref = "https://www.expressnews.com/sites/premiummysa/favicon.ico";
  } else if (MARKET_KEY === "Albany") {
    favHref =
      "https://www.timesunion.com/sites/timesunion/apple-touch-icon-152x152.png";
  } else if (MARKET_KEY === "CT") {
    favHref = "https://www.ctinsider.com/sites/premiumctpost/favicon-32x32.png";
  } else if (MARKET_KEY === "Texcom") {
    // TODO: Fill this in when the sites get swapped
  } else if (MARKET_KEY === "Midcom") {
    // TODO: Fill this in when the sites get swapped
  }

  // Set section with fallback
  let articleSection = "Local";
  if (SECTION) {
    articleSection = SECTION;
  }

  // Set the default schema that will be used as a fallback
  let schemaContent = `{
    "@context": "http://schema.org",
    "@type": "${schemaOverride.type || "NewsArticle"}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}"
    },
    "headline": "${schemaTitle}",
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
    "articleSection": "${articleSection}",
    "description": "${schemaDescription}"
  }`;

  // Format the date for WCM, cut off at the period
  let formattedPubDate = "";
  try {
    formattedPubDate = ISO_PUBDATE.split(".")[0].replace("T", " ");
  } catch (err) {
    // It's ok
  }

  return (
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <link rel="shortcut icon" href={favHref} type="image/x-icon" />
      <link rel="canonical" href={`${CANONICAL_URL}/${url_add}`} />
      {/* Preload the stylesheet */}
      <link
        rel="preload"
        href={`https://files.sfchronicle.com/brand-styles/${styleSheetID}.css`}
        as="style"
      />
      <link
        rel="stylesheet"
        href={`https://files.sfchronicle.com/brand-styles/${styleSheetID}.css`}
      />

      {isApp || EMBEDDED || noindex ? (
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
      <meta
        property="og:url"
        content={`${MAIN_DOMAIN}/${SUBFOLDER}${OPT_SLASH}${SLUG}/${url_add}`}
      />
      <meta property="og:image" content={IMAGE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:datePublished" content={formattedPubDate} />

      <script
        data-schema={schemaOverride.type || "NewsArticle"}
        type="application/ld+json"
      >
        {schemaOverride.content || schemaContent}
      </script>
    </Helmet>
  );
};

export default LayoutHelmet;
