const { safeDump: toYaml } = require('js-yaml')
const github = require('../lib/github')
const { map, filter, removeUndefinedFields, run } = require('../utils')

const SOURCE = 'Code and Talk'
const OWNER = 'szabgab'
const REPO = 'codeandtalk.com'
const PATH = 'data/events'

const eventProcessor = ({name, website, event_start, event_end, location: {city, country}, cfp_end, tags}) =>
    ({name, url: website, startDate: event_start, endDate: event_end, city, country, cfpUrl: '', cfpEndDate: cfp_end, source: SOURCE, tags})

const processor = content =>
    eventProcessor (JSON.parse(content))

const byYear = year => ({startDate}) => startDate.slice (0, 4) === year.toString ()

const currentYear = () => (new Date ()).getFullYear ()

const scrape = () =>
    github.getFiles (OWNER) (REPO) (PATH) (processor)
        .then (filter (byYear (currentYear ())))
        .then (map (removeUndefinedFields))
        .then (toYaml)

if (require.main === module) run (scrape)

module.exports =
    { scrape }
