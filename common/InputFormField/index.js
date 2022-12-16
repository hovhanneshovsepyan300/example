import React from 'react'
import PropTypes from 'prop-types'

import SharedTextInput from './../SharedTextInput'

import styles from './index.module.scss'

const InputFormField = ({
  onChange,
  onClick,
  value,
  name,
  error,
  label,
  placeholder,
  type,
  status,
  disable,
}) => {
  return (
    <div className={styles.inputFormFieldRoot}>
      <SharedTextInput
        value={value}
        name={name}
        placeholder={placeholder}
        label={label}
        type={type}
        onChange={onChange}
        onClick={onClick}
        withError={!!error}
        disable={disable}
      />
      <div
        className={`${styles.errorBlock} ${error ? styles.withErrorBlock : ''}`}
      >
        {error}
      </div>
      {!error && status ? <p>{status}</p> : null}
    </div>
  )
}

InputFormField.propTypes = {
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  status: PropTypes.string,
  placeholder: PropTypes.string,
}

InputFormField.defaultProps = {
  onChange: () => {},
  onClick: () => {},
  value: '',
  name: '',
  error: '',
  label: '',
  type: 'text',
  status: '',
  placeholder: '',
}

export default InputFormField
