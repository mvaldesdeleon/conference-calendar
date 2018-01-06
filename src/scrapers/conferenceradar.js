const yaml = require('js-yaml')
const github = require('../lib/github')
const { map } = require('../utils')

const SOURCE = 'Conference Radar'
const OWNER = 'conferenceradar'
const REPO = 'list'
const PATH = 'src/events/2018'

const trim = date =>
    date.slice(0, 10)

const eventProcessor = ({name, url, eventStartDate, eventEndDate, city, country, cfpEndDate}) =>
    ({name, url, startDate: trim (eventStartDate), endDate: trim (eventEndDate), city, country, cfpUrl: '', cfpEndDate: trim (cfpEndDate), source: SOURCE, tags: []})

const processor = content =>
    eventProcessor (JSON.parse(content))

const removeUndefinedFields = object =>
    Object.keys (object)
        .reduce (((clone, key) => Object.assign(clone, object[key] !== undefined ? {[key]: object[key]} : {})), {})

const scrape = () =>
    github.getFiles (OWNER) (REPO) (PATH) (processor)
        .then (map (removeUndefinedFields))
        .then (yaml.safeDump)

const print = text =>
    process.stdout.write (text)

const error = ({message}) =>
    (process.stderr.write (`${message}`), process.exitCode = -1, Promise.resolve())

if (require.main === module) {
    scrape()
        .then(print)
        .catch(error)
}

module.exports =
    { scrape }
