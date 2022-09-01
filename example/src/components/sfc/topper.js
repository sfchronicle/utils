import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Byline from './byline'
import NavTop from './navtop'
import ScrollDown from './scrolldown'
import {
  pubdateString,
  moddateString,
} from './component-helpers/datehelpers'
import * as topperStyles from '../../styles/modules/topper.module.less'
import WCMImage from './wcmimage'

const Topper = ({ meta }) => {
  const {
    PROJECT: { AUTHORS, ISO_MODDATE, ISO_PUBDATE, DISPLAY_TITLE, DECK },
  } = meta

  return (
    <Fragment>
      <NavTop meta={meta} />
      <header className={topperStyles.header}>
        <section
          aria-label="Topper headline, deck, byline and dateline"
          className={topperStyles.textContainer}
        >
          <h1 className={topperStyles.hed}>{DISPLAY_TITLE ? DISPLAY_TITLE : "A brave new template v2"}</h1>
          <h2 className={topperStyles.dek}>
            {DECK ? DECK : "Words can be like X-rays if you use them properly &mdash; they'll go through anything."}
          </h2>
          <div className={topperStyles.dateby}>
            <span>By</span>
            {AUTHORS.map((author, index) => {
              // Pass special flag if this is the last item
              let isLast = false
              if (index === AUTHORS.length - 1) {
                isLast = true
              }
              // Add the bylines
              return (
                <Byline
                  key={author.AUTHOR_NAME}
                  url={author.AUTHOR_PAGE}
                  name={author.AUTHOR_NAME}
                  index={index}
                  isLast={isLast}
                />
              )
            })}
            &nbsp;|&nbsp;
            <time
              className="topper-dateline"
              dateTime={ISO_PUBDATE}
              itemProp="datePublished"
            >
              {pubdateString}
            </time>
            {moddateString && (
              <Fragment>
                &nbsp;|&nbsp;
                <time
                  className="topper-dateline updated-date"
                  dateTime={ISO_MODDATE}
                  itemProp="dateModified"
                >
                  Updated: {moddateString}
                </time>
              </Fragment>
            )}
          </div>
        </section>
      </header>
      <figure className={topperStyles.figure}>
        {/* You can also use a 100vh/100vw with a normal img tag here, just make sure to set the container that way so we don't get layout shift */}
        <WCMImage wcm={20374215} alt="TKTKTK" lz={false} />

        {/* This prop gives the arrow an id to scroll to */}
        <ScrollDown scrollTo="article" />
        <figcaption className={topperStyles.topcap}>A man sitting on a hill with the Golden Gate Bridge in the background <span className={topperStyles.topcred}>(Scott Strazzante / San Francisco Chronicle)</span></figcaption>
      </figure>
    </Fragment>
  )
}

Topper.propTypes = {
  meta: PropTypes.object.isRequired,
}

export default Topper
