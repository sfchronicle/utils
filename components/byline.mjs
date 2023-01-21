import React, { Fragment } from 'react'
import Authors from './authors.mjs'
import ShareButtons from './sharebuttons.mjs'

import {
    pubdateString,
    moddateString,
} from './helpers/datehelpers.mjs'

const Byline = ({ meta }) => {
    const {
        PROJECT: { AUTHORS, ISO_MODDATE, ISO_PUBDATE },
      } = meta
      const has_authors = AUTHORS[0].AUTHOR_NAME !== ""

return (
    <>
        <div className="byline-wrapper">
            <div className="byline">
            {has_authors &&
              <>
              <span>By</span>
              {AUTHORS.map((author, index) => {
                // Pass special flag if this is the last item
                let isLast = false
                if (index === AUTHORS.length - 1) {
                  isLast = true
                }
                // Add the bylines
                return (
                  <Authors
                    key={author.AUTHOR_NAME}
                    url={author.AUTHOR_PAGE}
                    name={author.AUTHOR_NAME}
                    index={index}
                    isLast={isLast}
                  />
                )
              })}
              </>
            }
           
            { has_authors && <span>&nbsp;|&nbsp;</span> }

            {!has_authors && <span>Published </span>}
              { !moddateString && 
                <>
                  <time
                    className="topper-dateline"
                    dateTime={ISO_PUBDATE}
                    itemProp="datePublished"
                  >
                    {pubdateString}
                  </time>
                </>
              }
              {moddateString && (
                <Fragment>
                  <time
                    className="topper-dateline updated-date"
                    dateTime={ISO_MODDATE}
                    itemProp="dateModified"
                  >
                    Updated {moddateString}
                  </time>
                </Fragment>
              )}
            </div>
            <div className="articleHeader--shareTools">
              <div className="share-list" id="sharebutton-wrapper">
                <ShareButtons meta={meta} />
              </div>
            </div>
        </div>
    </>
    )
}

export default Byline