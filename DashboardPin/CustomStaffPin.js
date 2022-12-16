import React from 'react'
import { useDispatch } from 'react-redux'
import ReactDOM from 'react-dom'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { setMapCenter } from '../../stores/ReduxStores/dashboard/dashboard'
import StaffPin from './StaffPin'
import isEqual from 'lodash/isEqual'

export const CustomStaffinPin = ({
  staff,
  zIndexGenerator,
  event,
  showStaff,
  map,
}) => {
  const dispatch = useDispatch()

  const centerMap = ({ lat, lng }) => {
    dispatch(setMapCenter({ latitude: lat, longitude: lng }))
  }

  return staff.map(user => {
    const location = user.location
    const el = document.createElement('div')
    el.className = 'marker-staff'
    if (location.latitude !== 0 && location.longitude !== 0) {
      ReactDOM.render(
        <StaffPin
          key={`staff:${user.object_id}`}
          lat={location.latitude}
          lng={location.longitude}
          user={user}
          onClick={centerMap}
          zIndex={zIndexGenerator(location.latitude)}
          event={event}
        />,
        el,
      )
      if (showStaff)
        new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .addTo(map)
    }

    return null
  })
}

const CustomStaffinPins = React.memo(
  CustomStaffinPin,
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.staff, nextProps.staff) &&
      prevProps.showStaff === nextProps.showStaff
    )
  },
)
export default CustomStaffinPins
