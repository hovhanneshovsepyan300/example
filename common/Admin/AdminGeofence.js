import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Parse from 'parse'

import { AdminField, AdminButton, AdminGeofenceEditor } from '.'
import AdminGeofenceMapboxEditor from './AdminGeofenceMapboxEditor'
import { VARIANT } from '../../../utils/constants'

const propTypes = {
  onDeleteGeofence: PropTypes.func,
  onAddGeofence: PropTypes.func,
  points: PropTypes.arrayOf(PropTypes.instanceOf(Parse.GeoPoint)).isRequired,
  onGeofenceChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
}

const AdminGeofence = ({
  onDeleteGeofence,
  onAddGeofence,
  points,
  onGeofenceChange,
  name,
  onNameChange,
}) => {
  const geofenceEditorRef = React.createRef()
  return (
    <div className="admin-geofence">
      <AdminGeofenceMapboxEditor
        ref={geofenceEditorRef}
        geofencePoints={points}
        self={geofenceEditorRef.current}
        onChange={onGeofenceChange}
      />
      <div className="admin-geofence__field-and-buttons">
        <AdminField
          label="Geofence name"
          placeholder="Write here"
          type="text"
          value={name}
          onChange={onNameChange}
          required="Please provide a name for the geofence"
        />
        <div className="admin-geofence__btn-lower">
          <AdminButton
            hollow
            onClick={() => geofenceEditorRef.current.addMarker()}
          >
            Add Marker
          </AdminButton>
          <span className="admin-geofence__tip">
            Right-click on a marker to remove it
          </span>
        </div>

        <div className="admin-geofence__bottom-buttons">
          {onDeleteGeofence && (
            <AdminButton
              hollow
              variant={VARIANT.Secondary}
              onClick={() => onDeleteGeofence()}
            >
              Delete Geofence
            </AdminButton>
          )}
          {onAddGeofence && (
            <AdminButton onClick={() => onAddGeofence()}>
              Add Geofence
            </AdminButton>
          )}
        </div>
      </div>
    </div>
  )
}

AdminGeofence.propTypes = propTypes

AdminGeofence.defaultProps = { onDeleteGeofence: null, onAddGeofence: null }

export default AdminGeofence
