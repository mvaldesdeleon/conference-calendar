const yaml = require('js-yaml')
const github = require('../lib/github')
const { map, filter } = require('../utils')

const SOURCE = 'Code and Talk'
const OWNER = 'szabgab'
const REPO = 'codeandtalk.com'
const PATH = 'data/events'

const eventProcessor = ({name, website, event_start, event_end, location: {city, country}, cfp_end, tags}) =>
    ({name, url: website, startDate: event_start, endDate: event_end, city, country, cfpUrl: '', cfpEndDate: cfp_end, source: SOURCE, tags})

const processor = content =>
    eventProcessor (JSON.parse(content))

const removeUndefinedFields = object =>
    Object.keys (object)
        .reduce (((clone, key) => Object.assign(clone, object[key] !== undefined ? {[key]: object[key]} : {})), {})

const byYear = year => ({startDate}) => startDate.slice (0, 4) === year.toString()

const currentYear = () => (new Date()).getFullYear()

const scrape = () =>
    github.getFiles (OWNER) (REPO) (PATH) (processor)
        .then (filter (byYear (currentYear ())))
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
