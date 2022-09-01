import React from 'react'
import PropTypes from 'prop-types'
import * as creditsStyles from '../../styles/modules/credits.module.less'

const Credits = ({ type, children }) => (
  <>
    <p className={creditsStyles.title}>{type}</p>
    {children}
  </>
)

Credits.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Credits
