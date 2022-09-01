import React from 'react'
import PropTypes from 'prop-types'
import * as dropcapStyles from '../../styles/modules/dropcap.module.less'

const DropCap = ({ children }) => (
  <span className={dropcapStyles.dropcap}>
    {children}
  </span>
)

DropCap.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DropCap
