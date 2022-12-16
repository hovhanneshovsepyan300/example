import React from 'react'
import { useDispatch } from 'react-redux'
import ReactDOM from 'react-dom'
import { CustomIncidentTypesContext } from '../../Contexts'
import IncidentPin from './IncidentPin'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { setMapCenter } from '../../stores/ReduxStores/dashboard/dashboard'
import isEqual from 'lodash/isEqual'

export const CustomIncidentPin = ({
  incidents,
  map,
  customIncidentTypes,
  zIndexGenerator,
  showIncidents,
}) => {
  const dispatch = useDispatch()
  const centerMap = ({ lat, lng }) => {
    dispatch(setMapCenter({ latitude: lat, longitude: lng }))
  }

  return incidents.map(incident => {
    const { location } = incident.capture_data
    const el = document.createElement('div')
    el.className = 'marker'

    if (location.latitude !== 0 && location.longitude !== 0) {
      ReactDOM.render(
        <CustomIncidentTypesContext.Provider
          key={`incident:${incident.id}`}
          lat={location.latitude}
          lng={location.longitude}
          value={customIncidentTypes}
        >
          <IncidentPin
            incident={incident}
            onClick={() => centerMap(location.latitude, location.longitude)}
            zIndex={zIndexGenerator(location.latitude)}
            showIncidents={showIncidents}
            dispatch={dispatch}
          />
        </CustomIncidentTypesContext.Provider>,
        el,
      )

      if (showIncidents) {
        new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map)
      }
    }

    return null
  })
}

const CustomIncidentPins = React.memo(
  CustomIncidentPin,
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.incidents, nextProps.incidents) &&
      prevProps.showIncidents === nextProps.showIncidents
    )
  },
)

export default CustomIncidentPins
