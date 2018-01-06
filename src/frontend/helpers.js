const { isArray } = require('../utils')

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const makeEvent = ({name, url}) =>
    name && url ? `[${name}](${url})` : (name || '')

const makeLocation = ({city, country}) =>
    city && country ? `${city}, ${country}` : (city || country || '')

const date = date =>
    (date => `${MONTHS[date.getMonth ()]} ${date.getDate ()}`)(new Date(date))

const day = date =>
    (new Date(date)).getDate ()

const sameMonth = dateA => dateB => (new Date(dateA)).getMonth () === (new Date(dateB)).getMonth ()

const dates = startDate => endDate =>
    sameMonth (startDate) (endDate) ? `${date (startDate)}-${day (endDate)}` : `${date (startDate)}-${date (endDate)}`

const makeDate = ({startDate, endDate}) =>
    startDate && endDate ? dates (startDate) (endDate) : (date (startDate) || '')

const fullDate = date =>
    (date => `${MONTHS[date.getMonth ()]} ${date.getDate ()}, ${date.getFullYear ()}`)(new Date(date))

const _makeCFP = cfpEndDate => cfpUrl =>
    cfpEndDate && cfpUrl ? `[${fullDate (cfpEndDate)}](${cfpUrl})` : (cfpEndDate ? fullDate (cfpEndDate) : `[link](${cfpUrl})`)

const makeCFP = ({cfpEndDate, cfpUrl}) =>
    cfpEndDate || cfpUrl ? _makeCFP (cfpEndDate) (cfpUrl) : ''

const makeTags = ({tags}) =>
    isArray (tags) ? tags.join (', ') : ''

const makeSource = ({source}) =>
    source || ''

module.exports =
    { makeEvent, makeLocation, makeDate, makeCFP, makeTags, makeSource }
