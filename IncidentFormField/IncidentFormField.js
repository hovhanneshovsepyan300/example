import React, { useState } from 'react'
import propTypes from 'prop-types'

import { Button, Icon } from '../common'

import { INCIDENT_FIELD_TYPES, INCIDENT_CODE } from '../../utils/constants'
import SVGIcons from '../SVGIcons'
// import IncidentFormFieldMap from './IncidentFormFieldMap'
import IncidentFormFieldMapboxMap from './IncidentFromFieldMapboxMap'

const FieldPhoto = ({ handleChange, id }) => {
  const [fileDetails, setFileDetails] = useState('')
  return (
    <div className="imagePickerBox">
      <h4>Upload photo</h4>
      <input
        id="contained-button-file"
        type="file"
        className="inputClass"
        onChange={e => {
          handleChange(id, e.target.files[0])
          setFileDetails(e.target.files[0])
        }}
      />
      {fileDetails ? (
        <div className="imageContainer">
          <img
            alt=""
            src={URL.createObjectURL(fileDetails)}
            className="uploadedImage"
          />
          <button onClick={() => setFileDetails('')} className="closeButton">
            <SVGIcons name={'closeIcon'} />
          </button>
        </div>
      ) : (
        <label htmlFor="contained-button-file">
          <div className="imagePicker">
            <SVGIcons name={'addImage'} />
          </div>
        </label>
      )}
      <h5>{fileDetails.name}</h5>
      <h4>
        Please ask the informant if they have a recent protograph , maybe on
        their phone
      </h4>
    </div>
  )
}
FieldPhoto.propTypes = {
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
}
FieldPhoto.defaultProps = {}

const FieldPicker = ({
  placeholder,
  dataSource,
  handleChange,
  id,
  value,
  disabled,
}) => {
  const [showList, setShowList] = useState(false)
  const toggleDropDown = () => {
    setShowList(!showList)
  }
  const getPlaceholder = () => {
    let displayData = placeholder || 'Select...'
    if (value) {
      displayData = dataSource.find(data => data.value === value)?.text
    }
    return displayData
  }
  return (
    <div>
      <div className="dropDownContainer">
        <button className="dropDownButton" onClick={toggleDropDown}>
          <div>
            <SVGIcons name={'selectPointer'} />
            <h4>{getPlaceholder()}</h4>
          </div>
          <div
            className={
              showList && !disabled ? 'arrow-icon__rotate' : 'arrow-icon'
            }
          >
            <SVGIcons name={'arrowRight'} height={12} />
          </div>
        </button>
        <div className="dropDownListContainer">
          {showList && !disabled && (
            <ul className="dropDownList">
              <li
                onClick={() => {
                  handleChange(id, '')
                  toggleDropDown()
                }}
                aria-hidden="true"
              >
                <p>{placeholder || 'Select...'}</p>
              </li>
              {dataSource.map(val => (
                <li
                  onClick={() => {
                    handleChange(id, val.value)
                    toggleDropDown()
                  }}
                  aria-hidden="true"
                  key={val.value}
                >
                  <p>{val.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
FieldPicker.propTypes = {
  placeholder: propTypes.string,
  dataSource: propTypes.arrayOf(
    propTypes.shape({ text: propTypes.string, value: propTypes.string }),
  ).isRequired,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
  disabled: propTypes.bool,
}
FieldPicker.defaultProps = { placeholder: '', value: '', disabled: false }

const SwitchPicker = ({ dataSource, handleChange, id, value }) => (
  <ul className="switchPicker">
    {dataSource.map((val, i) => (
      <li
        key={val.value}
        onClick={() => handleChange(id, val.value)}
        aria-hidden="true"
        className={
          value === val.text || value === val.value || (i == 0 && !value)
            ? 'switchPicker active'
            : ''
        }
      >
        {val.text}
      </li>
    ))}
  </ul>
)
SwitchPicker.propTypes = {
  dataSource: propTypes.arrayOf(
    propTypes.shape({ text: propTypes.string, value: propTypes.string }),
  ).isRequired,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
}
SwitchPicker.defaultProps = { value: '' }

const ColorPicker = ({ dataSource, handleChange, id, value }) => (
  <ul className="colorPicker">
    {dataSource.map(val => (
      <li
        key={val.value}
        onClick={() => handleChange(id, val.value)}
        aria-hidden="true"
        className={value === val.value ? 'colorPicker active' : ''}
        style={{ backgroundColor: INCIDENT_CODE[val.value] }}
      >
        {val.text}
      </li>
    ))}
  </ul>
)
ColorPicker.propTypes = {
  dataSource: propTypes.arrayOf(
    propTypes.shape({ text: propTypes.string, value: propTypes.string }),
  ).isRequired,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
}
ColorPicker.defaultProps = { value: 'male' }

// TODO: keyboard type: number,phone, standard, validation stuff
const FieldInput = ({
  placeholder,
  handleChange,
  id,
  value,
  disabled,
  numberOnly,
  title,
}) => (
  <div className="textField">
    <h4>{title}</h4>
    <input
      type={numberOnly ? 'number' : 'text'}
      placeholder={placeholder}
      value={value}
      onChange={e => handleChange(id, e.target.value)}
      disabled={disabled}
      style={{ cursor: disabled && 'default' }}
    />
  </div>
)
FieldInput.propTypes = {
  placeholder: propTypes.string,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
  disabled: propTypes.bool,
  numberOnly: propTypes.bool,
  title: propTypes.bool,
}
FieldInput.defaultProps = {
  placeholder: '',
  value: '',
  disabled: false,
  numberOnly: false,
  title: '',
}

const FieldCollection = ({
  dataSource,
  renderChild,
  handleChange,
  id,
  value,
}) => (
  <div className="fieldCollection">
    {dataSource.map(val => renderChild(val, handleChange, id, value))}
  </div>
)
FieldCollection.propTypes = {
  dataSource: propTypes.arrayOf(
    propTypes.shape({ text: propTypes.string, value: propTypes.string }),
  ).isRequired,
  renderChild: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
}
FieldCollection.defaultProps = { value: '' }

const FieldTextview = ({
  placeholder,
  handleChange,
  id,
  value,
  disabled,
  title,
}) => (
  <div className="textareaMessage">
    {title}
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={e => handleChange(id, e.target.value)}
      disabled={disabled}
    />
  </div>
)
FieldTextview.propTypes = {
  placeholder: propTypes.string,
  id: propTypes.string.isRequired,
  handleChange: propTypes.func.isRequired,
  value: propTypes.string,
  title: propTypes.string,
  disabled: propTypes.bool,
}
FieldTextview.defaultProps = {
  placeholder: '',
  value: '',
  title: '',
  disabled: false,
}

const IncidentFormField = ({
  id,
  field_type,
  title,
  placeholder,
  dataSource,
  value_type,
  keyboard_type,
  handleChange,
  value,
  event,
  disabled,
  numberOnly,
  isInlineView,
}) => {
  let node
  switch (field_type) {
    case INCIDENT_FIELD_TYPES.photo:
      node = <FieldPhoto {...{ handleChange, value, id }} />
      break
    case INCIDENT_FIELD_TYPES.modal:
      node = (
        <FieldPicker {...{ dataSource, handleChange, value, id, disabled }} />
      )
      break
    case INCIDENT_FIELD_TYPES.map:
      node = (
        <IncidentFormFieldMapboxMap
          {...{ dataSource, placeholder, handleChange, value, id, event }}
        />
      )
      break
    case INCIDENT_FIELD_TYPES.field:
    case INCIDENT_FIELD_TYPES.numberfield:
      node = (
        <FieldInput
          {...{
            placeholder,
            keyboard_type,
            handleChange,
            value,
            id,
            disabled,
            numberOnly,
            title,
          }}
        />
      )
      break
    case INCIDENT_FIELD_TYPES.picker:
    case INCIDENT_FIELD_TYPES.table:
      node = (
        <FieldPicker
          {...{ placeholder, dataSource, handleChange, value, id, disabled }}
        />
      )
      break
    case INCIDENT_FIELD_TYPES.collection:
      node = (
        <FieldCollection
          {...{ value_type, dataSource, handleChange, value, id, disabled }}
          renderChild={(
            { text, value: val },
            localHandleChange,
            localId,
            selectedValue,
          ) => (
            <Button
              type="invisible"
              key={val}
              onClick={() => {
                localHandleChange(localId, text)
              }}
            >
              <div
                className={`colorBlock${
                  text === selectedValue ? '--selected' : ''
                }`}
                style={{
                  backgroundColor: `#${val}`,
                }}
              >
                {/* {text} */}
              </div>
            </Button>
          )}
        />
      )
      break
    case INCIDENT_FIELD_TYPES.textview:
      node = (
        <FieldTextview
          {...{ placeholder, handleChange, value, id, disabled, title }}
        />
      )
      break
    case INCIDENT_FIELD_TYPES.switchPicker:
      node = <SwitchPicker {...{ dataSource, handleChange, value, id }} />
      break
    case INCIDENT_FIELD_TYPES.incidentCodePicker:
      node = <ColorPicker {...{ dataSource, handleChange, value, id }} />
      break
    case INCIDENT_FIELD_TYPES.review:
    default:
      return null
  }
  // test
  return (
    <div
      className={`IncidentFormField${isInlineView ? '__inline-display' : ''}`}
    >
      <span className="IncidentFormField__label">
        {field_type !== INCIDENT_FIELD_TYPES.photo &&
        field_type !== INCIDENT_FIELD_TYPES.textview &&
        field_type !== INCIDENT_FIELD_TYPES.field &&
        field_type !== INCIDENT_FIELD_TYPES.numberfield
          ? title
          : isInlineView
          ? title
          : ''}
      </span>
      {node}
    </div>
  )
}

IncidentFormField.propTypes = {
  type: propTypes.string,
  id: propTypes.string,
  title: propTypes.string,
  mandatory: propTypes.bool,
  valueType: propTypes.string,
  placeholder: propTypes.string,
  keyboardType: propTypes.string,
  validation: propTypes.string,
  value: propTypes.any,
  handleChange: propTypes.func,
  event: propTypes.object,
  dataSource: propTypes.array,
  field_type: propTypes.string,
  value_type: propTypes.string,
  keyboard_type: propTypes.string,
  disabled: propTypes.bool,
  numberOnly: propTypes.bool,
  isInlineView: propTypes.bool,
}
IncidentFormField.defaultProps = {
  type: 'UNKNOWN TYPE',
  id: 'UNKNOWN ID',
  title: '',
  field_type: '',
  value_type: '',
  keyboard_type: '',
  mandatory: false,
  valueType: 'UNKNOWN VALUETYPE',
  placeholder: '',
  keyboardType: '',
  validation: '',
  value: undefined,
  handleChange: (/* id, value */) => {},
  event: null,
  dataSource: [],
  disabled: false,
  numberOnly: false,
  isInlineView: false,
}

export default IncidentFormField
