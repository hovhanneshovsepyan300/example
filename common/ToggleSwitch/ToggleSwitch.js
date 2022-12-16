import React from 'react'
import PropTypes from 'prop-types'
import { VARIANT } from '../../../utils/constants'

const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(Object.values(VARIANT)).isRequired,
}
const ToggleSwitch = ({ label, value, onChange, disabled, variant }) => (
  <div
    className={`toggle-switch toggle-switch--${variant} ${
      disabled ? 'toggle-switch--disabled' : ''
    }`}
  >
    <label className="toggle-switch__nice-switch">
      <input
        type="checkbox"
        className="toggle-switch__field"
        checked={value}
        onChange={e => (disabled ? null : onChange(e.target.checked))}
      />
      <span className="toggle-switch__css-switch" />
    </label>
    <label>{label}</label>
  </div>
)

ToggleSwitch.propTypes = propTypes

ToggleSwitch.defaultProps = {
  disabled: false,
}

export default ToggleSwitch
