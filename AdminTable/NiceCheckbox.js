import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
}

const NiceCheckbox = ({ onChange, ...otherProps }) => (
  <div className="checkbox-wrap">
    <label className="nice-checkbox">
      <input
        type="checkbox"
        onChange={e => onChange(e.target.checked)}
        {...otherProps}
      />
      <span style={{ cursor: otherProps.disabled && 'not-allowed' }} />
    </label>
  </div>
)

NiceCheckbox.propTypes = propTypes

NiceCheckbox.defaultProps = {}

export default NiceCheckbox
