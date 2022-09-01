import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import * as bylineStyles from '../../styles/modules/byline.module.less'

const Byline = ({ url, name, index, isLast }) => {
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
            <span className={bylineStyles.byline}>{name}</span>
          </a>
        </Fragment>
      ) : (
        <span>
          {prefix}
          {name}
        </span>
      )}
    </Fragment>
  )
}

Byline.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number,
  isLast: PropTypes.bool,
}

export default Byline
