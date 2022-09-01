import React from 'react'
import PropTypes from 'prop-types'
import { scrollToTarget } from './component-helpers/scrolldownhelpers'
import * as scrolldownStyles from '../../styles/modules/scrolldown.module.less'
import 'css.gg/icons/css/chevron-down.css'

const ScrollDown = ({ scrollTo }) => (
  <div className={scrolldownStyles.arrow}>
    <div
      tabIndex="0"
      role="button"
      className="gg-chevron-down"
      onClick={() => scrollToTarget(scrollTo)}
    ></div>
  </div>
)

ScrollDown.propTypes = {
  scrollTo: PropTypes.string.isRequired,
}

export default ScrollDown
