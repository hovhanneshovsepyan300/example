import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
import SharedDialog from '../SharedDialog'
// import ActionButton from '../../common/ActionButton'

const AccrediationSetupDialog = ({ open, onClose }) => {
  return (
    <div>
      <SharedDialog
        open={open}
        onClose={onClose}
        dialogTitle={
          <div className={styles.dialogTitle}>
            <div className={styles.titleTextContent}>Checking info</div>
          </div>
        }
        className={'model-box-wraper--popup'}
        // variation={DIALOG_VARIATIONS.withTopHeader}
      >
        <p className="model-box-wraper__paragraph">
          The <span> information is been checked,</span> please wait one moment.
        </p>
      </SharedDialog>
    </div>
  )
}
AccrediationSetupDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.bool,
}

AccrediationSetupDialog.defaultProps = {
  open: true,
  onClose: () => {},
}

export default AccrediationSetupDialog
