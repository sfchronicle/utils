import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const Authors = ({ url, name, index, isLast }) => {
  let prefix = ' '
  // Add necessary spacing and grammar
  if (index > 0) {
    prefix = ', '

    if (isLast) {
      prefix = ' and '
    }
  }

  return (
    <Fragment>
      {url ? (
        <Fragment>
          {prefix}
          <a target="_blank" rel="author noopener noreferrer" href={url}>
            <span className="byline-name">{name}</span>
          </a>
        </Fragment>
      ) : (
        <span>
          {prefix}
          <span className="byline-name">{name}</span>
        </span>
      )}
    </Fragment>
  )
}

Authors.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number,
  isLast: PropTypes.bool,
}

export default Authors