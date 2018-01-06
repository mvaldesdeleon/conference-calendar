const yaml = require('js-yaml')
const github = require('../lib/github')
const { map, awaitAll, concat, flatten } = require('../utils')

const SOURCE = 'Tech Conferences'
const OWNER = 'tech-conferences'
const JS_REPO = 'javascript-conferences'
const JS_PATH = 'conferences/2018/javascript.json'
const TECH_REPO = 'confs.tech'
const TECH_PATH = 'conferences/2018'

const eventProcessor = ({name, url, startDate, endDate, city, country, cfpUrl, cfpEndDate}) =>
    ({name, url, startDate, endDate, city, country, cfpUrl, cfpEndDate, source: SOURCE, tags: []})

const fileProcessor = map (eventProcessor)

const processor = content =>
    fileProcessor (JSON.parse(content))

const removeUndefinedFields = object =>
    Object.keys (object)
        .reduce (((clone, key) => Object.assign(clone, object[key] !== undefined ? {[key]: object[key]} : {})), {})

const scrape = () =>
    awaitAll ([
        github.getFile (OWNER) (JS_REPO) (JS_PATH) (processor),
        github.getFiles (OWNER) (TECH_REPO) (TECH_PATH) (processor)
    ])
        .then (([events, eventsList]) => concat (events) (flatten (eventsList)))
        .then (map (removeUndefinedFields))
        .then (yaml.safeDump)

module.exports =
    { scrape }