import React from 'react'
import Authors from './authors.mjs'
import ShareButtons from './sharebuttons.mjs'

import {
  pubdateString,
  moddateString,
} from './helpers/datehelpers.mjs'

const Byline = ({ meta, updateNote, updatePrefix, ReplacementTime, url_add }) => {
  const {
    PROJECT: { AUTHORS, ISO_MODDATE, ISO_PUBDATE },
  } = meta
  const has_authors = AUTHORS[0].AUTHOR_NAME !== ""

  // check the width of the byline wrapper. if it's less than @md or 672px, 
  // change the display type to "block" to avoid large white spaces with
  // the gift button
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    let bylineContainer = document.getElementById("byline-wrapper")
    if (bylineContainer && bylineContainer.offsetWidth < 672) {
      bylineContainer.style.display = "block"
    }
  }

  return (
    <>
      <div className="byline-wrapper" id="byline-wrapper">
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

          {has_authors && <span>{" "}|{" "}</span>}

          {!ReplacementTime &&
            <>
              {!moddateString &&
                <>
                  <time
                    className="topper-dateline"
                    dateTime={ISO_PUBDATE}
                    itemProp="datePublished"
                  >
                    {!has_authors && <span>Published </span>} {pubdateString}
                  </time>
                </>
              }
              {moddateString && (
                <>
                  <time
                    className="topper-dateline updated-date"
                    dateTime={ISO_MODDATE}
                    itemProp="dateModified"
                  >
                    {updatePrefix ? (
                      <>{updatePrefix}{' '}</>
                    ) : (
                      <>Updated{' '}</>
                    )}
                    {moddateString}
                  </time>
                </>
              )}
            </>
          }

          {ReplacementTime &&
            <ReplacementTime />
          }

          {/* Add a note if this is a live-updating project */}
          {updateNote && (
            <>
              <span>{" "}|{" "}</span>
              <span className="topper-update-note">{updateNote}</span>
            </>
          )}
        </div>
        <div className="articleHeader--shareTools">
          <div className="share-list" id="sharebutton-wrapper">
            <ShareButtons meta={meta} urlAdd={url_add} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Byline