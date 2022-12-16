import React from 'react'
import PropTypes from 'prop-types'
import utils from '../../../utils/helpers'

const ChatIcon = ({ name, size, backgroundColor, color, fontSize }) => {
  const initials = utils.getInitials(name)

  const style = {
    height: size,
    width: size,
    lineHeight: `${size}px`,
    borderRadius: `${size}px`,
    backgroundColor,
    color,
    marginRight: '12px',
    fontSize: fontSize,
  }

  return (
    <div style={style} className="ChatIcon">
      {initials}
    </div>
  )
}

ChatIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
}

ChatIcon.defaultProps = {
  size: 40,
  backgroundColor: 'lightgrey',
  color: 'inherit',
  fontSize: '12px',
}

export default ChatIcon
