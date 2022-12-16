import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

import { ReactComponent as DialogCloseIcon } from './../../../images/icons//dialog-close.svg'

// variations<string>: primary | withTopHeader

const DIALOG_VARIATIONS = {
  primary: 'primary',
  withTopHeader: 'withTopHeader',
}

const SharedDialog = ({
  open,
  children,
  fullWidth,
  dialogTitle,
  onClose,
  className,
  actionButtons,
  variation,
}) => {
  return open ? (
    <div className="model-box-wraper">
      <div
        className={styles.additionalDocumentBackdrop}
        onClick={onClose}
        id="dialog_backdrop"
      >
        <div className={`model-box-wraper__right ${className}`}>
          <div
            className={`${styles.dialogContainer} ${
              fullWidth ? styles.fullWidth : ''
            } ${
              variation === DIALOG_VARIATIONS.primary ? styles.primary : ''
            } ${
              variation === DIALOG_VARIATIONS.withTopHeader
                ? styles.withTopHeader
                : ''
            }`}
          >
            <div className={styles.dialogTitle}>
              {dialogTitle}
              <div
                id="dialog_close"
                className={styles.closeIconContainer}
                onClick={onClose}
              >
                <DialogCloseIcon className={styles.closeIcon} />
              </div>
            </div>
            {children}
            <div className={styles.dialogActions}>
              {actionButtons.map(button => button)}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

SharedDialog.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  dialogTitle: PropTypes.node,
  onClose: PropTypes.func,
  actionButtons: PropTypes.array,
  variation: PropTypes.string,
  className: PropTypes.string,
}

SharedDialog.defaultProps = {
  open: false,
  children: null,
  fullWidth: false,
  dialogTitle: null,
  onClose: () => {},
  actionButtons: [],
  variation: 'primary',
}

export default SharedDialog

export { DIALOG_VARIATIONS }
