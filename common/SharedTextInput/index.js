import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

import { ReactComponent as UploadIcon } from './.././../../images/icons/upload_icon2.svg'

const SharedTextInput = ({
  label,
  type,
  value,
  name,
  withError,
  endAdornment,
  disable,
  ...rest
}) => {
  const inputRef = useRef(null)

  return (
    <div
      className={`${styles.textInputItemRoot} ${
        withError ? styles.withErrorTextItemRoot : ''
      }`}
      onClick={() => {
        inputRef.current.focus()

        if (type === 'file') {
          inputRef.current.click()
        }
      }}
    >
       
      <p
        className={`${styles.label} ${withError ? styles.withErrorLabel : ''}`}
      >
        {label}
      </p>
      <input
        className={type === 'file' ? styles.hiddenInput : ''}
        ref={inputRef}
        type={type}
        value={value}
        name={name}
        disabled={disable}
        {...rest}
      />
      {endAdornment ? (
        <div className={styles.endAdornment}>{endAdornment}</div>
      ) : null}
      {type === 'file' ? (
        <div className={styles.endAdornment}>
          <UploadIcon />
        </div>
      ) : null}
    </div>
  )
}

SharedTextInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  withError: PropTypes.bool,
  endAdornment: PropTypes.node,
}

SharedTextInput.defaultProps = {
  label: 'Name',
  type: 'text',
  value: '',
  name: '',
  withError: false,
  endAdornment: null,
}

export default SharedTextInput
