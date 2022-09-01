import React from 'react'
import PropTypes from 'prop-types'
import * as buttonStyles from '../../styles/modules/button.module.less'

const Button = ({ click, type, text, style, className, name }) => {
  const buttonType = () => {
    switch (style) {
      case 'primary':
        return buttonStyles.btnPrimary
      case 'secondary':
        return buttonStyles.btnSecondary
      case 'disabled':
        return buttonStyles.btnDisabled
      default:
        return buttonStyles.btnPrimary
    }
  }

  return (
    <button
      name={name ? name : ""}
      onClick={click}
      type={type}
      className={className ? `${className} ${buttonType()}` : buttonType()}
    >
      {text}
    </button>
  )
}

Button.propTypes = {
  click: PropTypes.func,
  text: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.oneOf(['primary', 'secondary', 'disabled']).isRequired,
}

export default Button
