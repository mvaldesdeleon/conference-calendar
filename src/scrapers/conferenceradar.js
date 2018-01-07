const { safeDump: toYaml } = require('js-yaml')
const github = require('../lib/github')
const { map, removeUndefinedFields, run } = require('../utils')

const SOURCE = 'Conference Radar'
const OWNER = 'conferenceradar'
const REPO = 'list'
const PATH = 'src/events/2018'

const trim = date =>
    date.slice(0, 10)

const eventProcessor = ({name, url, eventStartDate, eventEndDate, city, country, cfpEndDate}) =>
    ({name, url, startDate: trim (eventStartDate), endDate: trim (eventEndDate), city, country, cfpUrl: '', cfpEndDate: trim (cfpEndDate), source: SOURCE, tags: []})

const processor = content =>
    eventProcessor (JSON.parse (content))

const scrape = () =>
    github.getFiles (OWNER) (REPO) (PATH) (processor)
        .then (map (removeUndefinedFields))
        .then (toYaml)

if (require.main === module) run (scrape)

module.exports =
    { scrape }
