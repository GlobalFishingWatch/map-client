import moment from 'moment'
import { USER_PERMISSIONS } from './constants'

// Application settings
export const TIMELINE_STEP = 24 * 60 * 60 * 1000 // 1 day // TODO MAP MODULE: DUPLICATE VALUE
export const MIN_FRAME_LENGTH_MS = TIMELINE_STEP // 1 day  // TODO MAP MODULE: DUPLICATE VALUE

// Absolute maximum supported
export const TIMELINE_OVERALL_START_DATE = new Date(Date.UTC(2012, 0, 1))
export const TIMELINE_OVERALL_END_DATE = moment()
  .subtract(3, 'days')
  .toDate()

export const TIMELINE_DEFAULT_OUTER_START_DATE = new Date(Date.UTC(2015, 0, 1))
export const TIMELINE_DEFAULT_OUTER_END_DATE = new Date(Date.UTC(2016, 0, 1))

export const TIMELINE_DEFAULT_INNER_START_DATE = new Date(Date.UTC(2015, 0, 1))
export const TIMELINE_DEFAULT_INNER_END_DATE = new Date(Date.UTC(2015, 1, 1))

export const TIMELINE_MIN_INNER_EXTENT = 1.21e9 // 2 weeks

export const TIMELINE_MAX_STEPS = 190 // six months
export const TIMELINE_MAX_TIME = TIMELINE_STEP * TIMELINE_MAX_STEPS // six months
export const TIMELINE_MIN_TIME = TIMELINE_STEP // 1 day

export const TIMELINE_SPEED_CHANGE = 2 // 2 for double and half speed
export const TIMELINE_MAX_SPEED = 16
export const TIMELINE_MIN_SPEED = 0.03125

export const GUEST_PERMISSION_SET = [
  USER_PERMISSIONS.shareWorkspace,
  USER_PERMISSIONS.seeVesselsLayers,
]

// for now, auth users get no special permissions, everything comes from the API
export const AUTH_PERMISSION_SET = GUEST_PERMISSION_SET

// At which intervals should we consider showing a new frame. Impacts performance.
// Expressed in ms, for example 86400000 is 1 day (24*60*60*1000)
export const PLAYBACK_PRECISION = 86400000
export const TIMELINE_OVERALL_START_DATE_OFFSET = Math.floor(
  TIMELINE_OVERALL_START_DATE / PLAYBACK_PRECISION
)

// Legacy: this is only here for compatibility with pre-mapbox branch workspaces
export const COLORS = {
  orange: '#F95E5E',
  peach: '#fca26f',
  yellow: '#FBFF8B',
  green: '#abff35',
  brightGreen: '#00ff6a',
  lightBlue: '#67FBFE',
  blue: '#7D84FA',
  purple: '#bb00ff',
  pink: '#ff81e5',
}

export const PALETTE_COLORS = [
  { color: '#F95E5E', hue: 0 },
  { color: '#33B679' },
  { color: '#F09300' },
  { color: '#FBFF8B', hue: 60 },
  { color: '#00ff6a', hue: 145 },
  { color: '#9E6AB0' },
  { color: '#F4511F' },
  { color: '#B39DDB' },
  { color: '#0B8043' },
  { color: '#67FBFE', hue: 182 },
  { color: '#069688' },
  { color: '#4184F4' },
  { color: '#AD1457' },
  { color: '#ff81e5', hue: 312 },
  { color: '#C0CA33' },
  { color: '#bb00ff', hue: 284 },
  { color: '#abff35', hue: 85 },
  { color: '#7D84FA', hue: 236 },
  { color: '#fca26f', hue: 22 },
]

export const PALETTE_COLORS_LAYERS = PALETTE_COLORS.filter((tint) => tint.hue !== undefined)
export const NO_COLOR_TOGGLE_DEFAULT = PALETTE_COLORS[11]

export const DEFAULT_TRACK_PALETTE_INDEX = 13
export const ACTIVITY_HIGHLIGHT_HUE = 312

export const ENCOUNTERS_VESSEL_COLOR = '#FF0000'
export const ENCOUNTERS_REEFER_COLOR = '#ffbcc6'

// tracks
export const TRACK_DEFAULT_COLOR = PALETTE_COLORS[8].color

// time range options in the duration picker menu
// replace moment humanized duration: use '1 month' instead of 'one month'
// https://momentjs.com/docs/#/customization/relative-time/
moment.updateLocale('en', {
  relativeTime: {
    m: '1 minute',
    h: '1 hour',
    d: '1 day',
    M: '1 month',
    y: '1 year',
  },
})

export const DURATION_PICKER_OPTIONS = [
  moment.duration(1, 'week'),
  moment.duration(15, 'days'),
  moment.duration(1, 'month'),
  moment.duration(3, 'months'),
]

export const FORMAT_DATE = 'MMM Do YYYY'
export const FORMAT_TIME = 'h:mm A'
export const FORMAT_NUM_DECIMALS = {
  distanceKm: 3,
  speedKnots: 3,
}

// search
export const SEARCH_RESULTS_LIMIT = 4
export const SEARCH_QUERY_MINIMUM_LIMIT = 3
export const SEARCH_MODAL_PAGE_SIZE = 14

export const DEFAULT_EMBED_SIZE = 'Small'
export const EMBED_SIZE_SETTINGS = [
  {
    name: 'Small',
    width: 600,
    height: 400,
  },
  {
    name: 'Medium',
    width: 800,
    height: 600,
  },
  {
    name: 'Large',
    width: 1000,
    height: 800,
  },
]

export const SUBSCRIBE_DEFAULT_FREQUENCY = 'single'
export const SUBSCRIBE_SETTINGS = [
  {
    name: 'One-time report',
    value: 'single',
  },
  {
    name: 'Daily report',
    value: 'daily',
  },
  {
    name: 'Weekly report',
    value: 'weekly',
  },
  {
    name: 'Monthly report',
    value: 'monthly',
  },
]
