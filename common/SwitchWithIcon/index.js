import React from 'react'
import PropTypes from 'prop-types'

const SwitchWithIcon = ({ label, checked, handleChange, disabled }) => {
  return (
    <label
      // htmlFor="switch_input"
      className="switch_with_icon"
      onClick={() => {
        document.getElementById('switch_input').focus()
      }}
    >
      <input
        id="switch_input"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className="switch_with_icon-slider"></span>
      <span className="label_text">{label}</span>
    </label>
  )
}

SwitchWithIcon.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
}

SwitchWithIcon.defaultProps = {
  label: '',
  checked: false,
  handleChange: () => {},
  disabled: false,
}

export default SwitchWithIcon
