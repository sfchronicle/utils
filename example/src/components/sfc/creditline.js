import React from 'react'
import PropTypes from 'prop-types'
import * as creditlineStyles from '../../styles/modules/creditline.module.less'

const CreditLine = ({ name, email, twitter }) => (
  <p className={creditlineStyles.text}>
    {name}
    {email && (
      <span>
        &nbsp;• <a href={`mailto:${email} `}>{email.toLowerCase()}</a>{' '}
      </span>
    )}
    {twitter && (
      <span>
        &nbsp;•{' '}
        <a
          className={creditlineStyles.link}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://twitter.com/${twitter} `}
        >
          @{twitter}
        </a>
      </span>
    )}
  </p>
)

CreditLine.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
  twitter: PropTypes.string,
}

export default CreditLine
