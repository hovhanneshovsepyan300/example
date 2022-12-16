import React from 'react'
import PropTypes from 'prop-types'

const Badge = ({ badge, width }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '1px 8px',
        borderRadius: '100px',
        color: badge.color,
        fontSize: '14px',
        lineHeight: ' 21px',
        textAlign: 'center',
        border: `1px solid ${badge.color}`,
        width: width,
      }}
    >
      {badge.label}
    </div>
  )
}

Badge.propTypes = {
  badge: PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  width: PropTypes.string,
}

Badge.defaultProps = {
  width: '70px',
}

export default Badge
