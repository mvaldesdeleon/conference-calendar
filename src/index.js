const { scrape: techConferences } = require('./scrapers/tech-conferences')
const { scrape: codeAndTalk } = require('./scrapers/codeandtalk')
const { scrape: conferenceRadar } = require('./scrapers/conferenceradar')
const { aggregate } = require('./aggregator')
const { render } = require('./frontend')

const { awaitAll, run } = require('./utils')

const pipeline = () =>
    awaitAll ([
        techConferences(),
        codeAndTalk(),
        conferenceRadar()
    ])
        .then (eventsList => eventsList.join('\n'))
        .then (aggregate)
        .then (render)

if (require.main === module) run (pipeline)
