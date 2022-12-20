import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
// import useSWR from 'swr'
// import { getData } from '../components/sfc/component-helpers/requesthelpers'
import Layout from '../components/layout'
import WCMImage from '../components/sfc/wcmimage'
import DropCap from '../components/sfc/dropcap'
import { useCanNativeLazyLoad } from '../components/sfc/component-helpers/customhooks'
import Topper from '../components/sfc/topper'
import RelatedSection from '../components/sfc/relatedsection'
import CreditsSection from '../components/sfc/creditssection'
import Ad from '../components/sfc/ad'
import Newsletter from '../components/sfc/newsletter'
import NavTop from '../components/sfc/navtop'
import Topper2 from '../../../components/topper2.mjs'

let rawCredits;
try {
	rawCredits = require('../data/credits.sheet.json')
} catch (err){
    // It's fine
    rawCredits = null;
}

let related_links;
try {
  related_links = require('../data/related_links.sheet.json')
} catch(err){
  related_links = require('../data/sfc/related_links.json')
}

let topperSettings;
try {
  topperSettings = require('../data/topper2_settings.sheet.json')
} catch {
  topperSettings = null;
}

const IndexPage = ({ data }) => {
  // easy hooks based request library
  // const { data: responseData, error } = useSWR('https://api.kanye.rest', getData, {
  //   onSuccess: (data) => console.log(data),
  //   onError: (err) => console.log(err),
  // })

  // custom hook checks for nativelazyload
  const lazy = useCanNativeLazyLoad()

  const {
    site: { siteMetadata },
    allRelatedLinksJson: { nodes: relatedLinks },
    allWcmPhotos
  } = data

  return (
    <Layout meta={siteMetadata}>
      {/* <Topper2 settings={topperSettings[0]} /> */}
      <NavTop meta={siteMetadata} />
      <Topper2 settings={topperSettings[0]} wcmData={allWcmPhotos} />
      {/* <Topper meta={siteMetadata} topperSettings={topperSettings[0]} wcmData={allWcmPhotos} /> */}
      <main>
        <article>
          <p>
            <DropCap>T</DropCap>
            he Savage nodded, frowning. "You got rid of them. Yes, that's just
            like you. Getting rid of everything unpleasant instead of learning
            to put up with it. Whether 'tis better in the mind to suffer the
            slings and arrows or outrageous fortune, or to take arms against a
            sea of troubles and by opposing end them... But you don't do either.
            Neither suffer nor oppose. You just abolish the slings and arrows.
            It's too easy."
          </p>

          <p>
            The Savage nodded, frowning. "You got rid of them. Yes, that's just
            like you. Getting rid of everything unpleasant instead of learning
            to put up with it. Whether 'tis better in the mind to suffer the
            slings and arrows or outrageous fortune, or to take arms against a
            sea of troubles and by opposing end them... But you don't do either.
            Neither suffer nor oppose. You just abolish the slings and arrows.
            It's too easy."
          </p>

          {/* Wrapping div supports "embed-" + center/left/right/full classes */}
          <div className="embed-center">
            <WCMImage wcm={20374215} alt="TKTKTK" lz={lazy} cap={"TKTKTK caption"} />
          </div>

          <p>
            The Savage nodded, frowning. "You got rid of them. Yes, that's just
            like you. Getting rid of everything unpleasant instead of learning
            to put up with it. Whether 'tis better in the mind to suffer the
            slings and arrows or outrageous fortune, or to take arms against a
            sea of troubles and by opposing end them... But you don't do either.
            Neither suffer nor oppose. You just abolish the slings and arrows.
            It's too easy."
          </p>

          <Ad adLetter="A" />

          <Newsletter />
        </article>
      </main>

      <RelatedSection links={related_links} />
      {rawCredits && <CreditsSection creditsData={rawCredits}/>}
    </Layout>
  )
}

export const query = graphql`
  {
    site {
      siteMetadata {
        EMBEDDED
        MAIN_DOMAIN
        PAYWALL_SETTING
        PROJECT {
          AUTHORS {
            AUTHOR_NAME
            AUTHOR_PAGE
          }
          DATE
          DESCRIPTION
          HEARST_CATEGORY
          KEY_SUBJECTS
          DECK
          DISPLAY_TITLE
          IMAGE
          ISO_MODDATE
          ISO_PUBDATE
          OPT_SLASH
          SLUG
          SOCIAL_TITLE
          SUBFOLDER
          TITLE
          TWITTER_TEXT
          ANALYTICS_CREDIT
          MARKET_KEY
          CANONICAL_URL
        }
      }
    }
    allRelatedLinksJson {
      nodes {
        wcmid
        title
        url
      }
    }
    allWcmPhotos {
      nodes {
        photo {
          ratio
          wcmid
          full_path
        }
      }
    }
  }
`
IndexPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default IndexPage
