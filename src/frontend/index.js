const { safeLoad: fromYaml } = require('js-yaml')
const { resolve } = require('path')
const { promisify } = require('util')
const { readFile } = require('fs')
const { compile } = require('handlebars')
const getStdin = require('get-stdin')
const { map, run } = require('../utils')
const { makeEvent, makeLocation, makeDate, makeCFP, makeTags, makeSource } = require('./helpers')

const TEMPLATE = 'template.md'
const COL = (title, gen) => ({title, gen})
const COLUMNS = [
    COL('Event', makeEvent),
    COL('Location', makeLocation),
    COL('Date', makeDate),
    COL('CFP', makeCFP),
    COL('Tags', makeTags),
    COL('Source', makeSource)
]

const templatePath =
    resolve (`${__dirname}/${TEMPLATE}`)

const loadTemplate = () =>
    promisify (readFile) (templatePath, 'utf8')

const header = () =>
    map (({title}) => title) (COLUMNS)
        .join(' | ')

const separator = () =>
    map (() => '---') (COLUMNS)
        .join(' | ')

const templateEvent = event =>
    map (({gen}) => gen (event)) (COLUMNS)
        .join(' | ')

const templateData = events =>
    ({header: header (), separator: separator (), events: map (templateEvent) (events)})

const renderEvents = events => template =>
    template (templateData (events))

const render = yaml =>
    loadTemplate ()
        .then (compile)
        .then (renderEvents (fromYaml (yaml)))

if (require.main === module) run (() => getStdin ().then (render))

module.exports =
    { render }
