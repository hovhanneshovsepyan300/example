import React from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as Message } from '../images/icons/icon-message.svg'
import { ReactComponent as Lockdown } from '../images/icons/icon-lockdown.svg'
import { ReactComponent as Evacuate } from '../images/icons/icon-evacuate.svg'
import { ReactComponent as Drone } from '../images/icons/icon-drone.svg'
import { ReactComponent as Warning } from '../images/icons/icon-warning.svg'
import { ReactComponent as User } from '../images/icons/icon-user-side.svg'
import { ReactComponent as Coded } from '../images/icons/icon-coded.svg'
import { ReactComponent as Drinks } from '../images/icons/icon-drinks.svg'
import { ReactComponent as Ejection } from '../images/icons/icon-ejection.svg'
import { ReactComponent as Emergency } from '../images/icons/icon-emergency.svg'
import { ReactComponent as Hotline } from '../images/icons/icon-hotline.svg'
import { ReactComponent as Lost } from '../images/icons/icon-lost.svg'
import { ReactComponent as Medical } from '../images/icons/icon-medical.svg'
import { ReactComponent as MissingPerson } from '../images/icons/icon-missing-person.svg'
import { ReactComponent as Noises } from '../images/icons/icon-noise.svg'
import { ReactComponent as Other } from '../images/icons/icon-other.svg'
import { ReactComponent as PerimeterBreach } from '../images/icons/icon-perimeter-breach.svg'
import { ReactComponent as Suspicious } from '../images/icons/icon-suspicious-activity.svg'
import { ReactComponent as Theft } from '../images/icons/icon-theft.svg'
import { ReactComponent as Violence } from '../images/icons/icon-violence.svg'
import { ReactComponent as SelectPointer } from '../images/icons/icon-mouse-pointer.svg'
import { ReactComponent as ArrowDown } from '../images/icons/icon-arrow-down.svg'
import { ReactComponent as ArrowRight } from '../images/icons/icon-arrow-right.svg'
import { ReactComponent as AddImage } from '../images/icons/icon-camera.svg'
import { ReactComponent as CloseIcon } from '../images/icons/icon-x.svg'
import { ReactComponent as LeftArrow } from '../images/icons/icon-left-circle.svg'
import { ReactComponent as RightArrow } from '../images/icons/icon-right-circle.svg'
import { ReactComponent as FeatureIcon } from '../images/icons/icon-features.svg'
import { ReactComponent as Hardware } from '../images/icons/icon-hardware.svg'
import { ReactComponent as Settings } from '../images/icons/icon-settings.svg'
import { ReactComponent as Details } from '../images/icons/icon-details.svg'
import { ReactComponent as Location } from '../images/icons/icon-location.svg'
import { ReactComponent as Documents } from '../images/icons/icon-documents.svg'
import { ReactComponent as Zones } from '../images/icons/icon-zones.svg'
import { ReactComponent as People } from '../images/icons/icon-people.svg'
import { ReactComponent as EditBlack } from '../images/icons/icon-edit-black.svg'
import { ReactComponent as CalendarBlue } from '../images/icons/icon-calendar-blue.svg'
import { ReactComponent as Delete } from '../images/icons/icon-delete.svg'
import { ReactComponent as Download } from '../images/icons/icon-download.svg'
import { ReactComponent as Upload } from '../images/icons/icon-upload.svg'
import { ReactComponent as Task } from '../images/icons/icon-check-circle.svg'
import { ReactComponent as AudienceView } from '../images/icons/icon-audience-view.svg'
import { ReactComponent as Search } from '../images/icons/icon-search.svg'

const propTypes = {
  name: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
}

const iconName = {
  drone: Drone,
  evacuate: Evacuate,
  lockdown: Lockdown,
  message: Message,
  unread: Warning,
  userIcon: User,
  missingPerson: MissingPerson,
  medical: Medical,
  lostProperty: Lost,
  other: Other,
  healthSafety: Medical,
  perimeterBreach: PerimeterBreach,
  violence: Violence,
  theft: Theft,
  drugs: Drinks,
  ejection: Ejection,
  emergency: Emergency,
  suspicious: Suspicious,
  hotline: Hotline,
  coded: Coded,
  noise: Noises,
  selectPointer: SelectPointer,
  arrowDown: ArrowDown,
  arrowRight: ArrowRight,
  addImage: AddImage,
  closeIcon: CloseIcon,
  rightArrow: RightArrow,
  leftArrow: LeftArrow,
  settings: Settings,
  features: FeatureIcon,
  hardware: Hardware,
  details: Details,
  location: Location,
  documents: Documents,
  zones: Zones,
  people: People,
  editBlack: EditBlack,
  calendarBlue: CalendarBlue,
  delete: Delete,
  download: Download,
  upload: Upload,
  tasks: Task,
  audienceView: AudienceView,
  search: Search,
}

const SVGIcons = ({ name, height, width }) => {
  let Icon = iconName[name] || iconName['other']
  return <Icon height={height} width={width} />
}

SVGIcons.propTypes = propTypes

SVGIcons.defaultProps = {
  height: 22,
  width: 22,
}

export default SVGIcons
