import React from 'react'
import PropTypes from 'prop-types'

const MiscCredit = ({ link, text }) => (
  <p>
    <a href={link} rel="noopener noreferrer" target="_blank">
      {text}
    </a>
  </p>
)

MiscCredit.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
}

export default MiscCredit
