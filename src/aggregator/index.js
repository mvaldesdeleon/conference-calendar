const { safeDump: toYaml, safeLoad: fromYaml } = require('js-yaml')
const getStdin = require('get-stdin')
const { run } = require('../utils')

const deduplicate = events =>
    events

const aggregate = yaml =>
    toYaml (deduplicate (fromYaml (yaml)))

if (require.main === module) run (() => getStdin ().then (aggregate))

module.exports =
    { aggregate }
