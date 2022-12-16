import React from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
import SharedDialog from '../SharedDialog'
// import ActionButton from '../../common/ActionButton'

const AccreditationSendMailDialog = ({ open, onClose }) => {
  return (
    <div>
      <SharedDialog
        open={open}
        onClose={onClose}
        dialogTitle={
          <div className={styles.dialogTitle}>
            <div className={styles.titleTextContent}>Mail was sent</div>
          </div>
        }
        className={'email-popup'}
        // variation={DIALOG_VARIATIONS.withTopHeader}
      >
        <p className="email-popup__paragraph">
          We will let you know when accreditation of @name finalize.
        </p>
      </SharedDialog>
    </div>
  )
}
AccreditationSendMailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.bool,
}

AccreditationSendMailDialog.defaultProps = {
  open: true,
  onClose: () => {},
}

export default AccreditationSendMailDialog
