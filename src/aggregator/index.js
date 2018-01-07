const { safeDump: toYaml, safeLoad: fromYaml } = require('js-yaml')
const getStdin = require('get-stdin')
const { run, filter } = require('../utils')

const deduplicate = events =>
    events

const sort = events =>
    events.sort (({startDate: dateA}, {startDate: dateB}) => Date.parse(dateA) - Date.parse(dateB))

const validIfSet = date =>
    date ? date.length === 10 : true

const saneEvent = ({name, startDate, endDate, cfpEndDate}) =>
    name && startDate && validIfSet (startDate) && validIfSet (endDate) && validIfSet (cfpEndDate)

const aggregate = yaml =>
    toYaml (sort (deduplicate (filter (saneEvent) (fromYaml (yaml)))))

if (require.main === module) run (() => getStdin ().then (aggregate))

module.exports =
    { aggregate }
