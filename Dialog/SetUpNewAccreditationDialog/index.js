import React, { useState } from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

import SharedDialog, { DIALOG_VARIATIONS } from '../SharedDialog'
import ActionButton from '../../common/ActionButton'
import SharedTextInput from '../../common/SharedTextInput'

import { ReactComponent as AccreditationIcon } from './.././../../images/icons/accreditation-dialog-icon.svg'
import AccrediationSetupDialog from './AccrediationSetupDialog'
import AccreditationSendMailDialog from './AccreditationSendMailDialog'

const DIALOG_MODES = {
  choose: 'choose',
  setNow: 'set-now',
  sendEmail: 'send-email',
}

const TMP_FIELDS_DATA = [
  { id: 1, label: 'Selfie', type: 'file', value: '' },
  { id: 2, label: 'Info required 3', type: 'file', value: '' },
  { id: 3, label: 'Info required 3', type: 'file', value: '' },
  { id: 4, label: 'Info required two', type: 'file', value: '' },
]

const SetUpNewAccreditationDialog = ({ open, handleCloseDialog }) => {
  const [dialogMode, setDialogMode] = useState(DIALOG_MODES.choose)
  const [setupInfoFields, setSetupInfoFields] = useState(TMP_FIELDS_DATA)
  const [openSetupDialog, setOpenSetupDialog] = useState(false)
  const [openEmailDialog, setOpenEmailDialog] = useState(false)
  const handleSetDialogMode = mode => () => setDialogMode(mode)

  const handleCancel = e => {
    if (
      dialogMode !== DIALOG_MODES.choose &&
      (e.currentTarget.id === 'dialog_close' ||
        e.currentTarget.id === 'setup_now_dialog_cancel')
    ) {
      setDialogMode(DIALOG_MODES.choose)
    } else {
      handleCloseDialog(e)
    }
  }
  const handleOpenSetupDialog = () => {
    setOpenSetupDialog(true)
  }
  const handleCloseSetupDialog = () => {
    setOpenSetupDialog(false)
  }

  const handleOpenEmailDialog = () => {
    setOpenEmailDialog(true)
  }
  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false)
  }

  const handleChange = (e, id) => {
    const data = setupInfoFields.map(field => {
      if (field.id === id) return { ...field, value: e.target.files[0] }
      return field
    })
    setSetupInfoFields(data)
  }
  return (
    <SharedDialog
      open={open}
      onClose={handleCancel}
      dialogTitle={
        <div className={styles.dialogTitle}>
          <AccreditationIcon />
          <div className={styles.titleTextContent}>Accreditation</div>
        </div>
      }
      variation={DIALOG_VARIATIONS.withTopHeader}
    >
      <div className={styles.dialogBody}>
        {dialogMode === DIALOG_MODES.choose ? (
          <>
            <p className={styles.paragraphContent}>
              Please, confirm how do you want{' '}
              <strong>to set up the new accreditation:</strong>
            </p>
            <div className={styles.chooseActionsBlock}>
              <div className={styles.btnContainer}>
                <ActionButton
                  title="Setup info now"
                  onClick={handleSetDialogMode(DIALOG_MODES.setNow)}
                />
              </div>
              <div className={styles.btnContainer}>
                <ActionButton
                  title="Send link to staff member"
                  variation="outlined"
                  onClick={handleSetDialogMode(DIALOG_MODES.sendEmail)}
                />
              </div>
            </div>
          </>
        ) : null}
        {dialogMode === DIALOG_MODES.setNow ? (
          <>
            <div className={styles.setUpNowTitle}>Set up info now</div>
            {setupInfoFields.map((field, i) => (
              <div className={styles.fieldBlock} key={field.id}>
                <SharedTextInput
                  label={field.label}
                  type={field.type}
                  // value={(field.value && field.value.name) || ''}
                  onChange={e => handleChange(e, field.id)}
                />
              </div>
            ))}
            <div className={styles.actionBlock}>
              <div className={styles.actionContainer}>
                <ActionButton
                  variation="outlined"
                  title="Cancel"
                  onClick={handleCancel}
                  id="setup_now_dialog_cancel"
                />
              </div>
              <div className={styles.actionContainer}>
                <ActionButton title="Submit" onClick={handleOpenSetupDialog} />
              </div>
            </div>
          </>
        ) : null}
        {dialogMode === DIALOG_MODES.sendEmail ? (
          <>
            <div className={styles.setUpNowTitle}>Send an e-mail to @mail</div>
            <div className={styles.actionBlock}>
              <div className={styles.actionContainer}>
                <ActionButton
                  variation="outlined"
                  title="Cancel"
                  onClick={handleCancel}
                  id="setup_now_dialog_cancel"
                />
              </div>
              <div className={styles.actionContainer}>
                <ActionButton title="Submit" onClick={handleOpenEmailDialog} />
              </div>
            </div>
          </>
        ) : null}
        <div className="dialog-setup-accrediation">
          <AccrediationSetupDialog
            open={openSetupDialog}
            onClose={handleCloseSetupDialog}
          />
        </div>
        <div className="dialog-email-accrediation">
          <AccreditationSendMailDialog
            open={openEmailDialog}
            onClose={handleCloseEmailDialog}
          />
        </div>
      </div>
    </SharedDialog>
  )
}

SetUpNewAccreditationDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
}

SetUpNewAccreditationDialog.defaultProps = {
  open: true,
  handleCloseDialog: () => {},
}

export default SetUpNewAccreditationDialog
