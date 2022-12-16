import React from 'react'
import PropTypes from 'prop-types'

// variation: primary | secondary | outlined | grey

const ActionButton = ({ variation, icon, title, type, ...rest }) => {
  return (
    <button className={`action_btn ${variation}`} type={type} {...rest}>
      {icon}
      {title}
    </button>
  )
}

ActionButton.propTypes = {
  variation: PropTypes.string,
  title: PropTypes.node,
  icon: PropTypes.node,
  type: PropTypes.string,
}

ActionButton.defaultProps = {
  variation: 'primary',
  title: '',
  icon: null,
  type: 'button',
}

export default ActionButton
