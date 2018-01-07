# Conference Calendar

Currently working on the proof of concept version. Preeliminary data available [here](https://github.com/mvaldesdeleon/conference-calendar/blob/master/dist/output.md), deduplication still pending.

# Mission Statement

## The Problem

As a developer wanting to get started as a technical speaker, I need to be aware of all technical conferences open to certain topics that might be going on in the following, say, 12 months.

Personally, I am interested in JavaScript and Functional Programming.

Before starting this project, I tried (quickly and poorly) to find if what I needed already existed.

This research yielded the following actively-maintained results:

* https://confs.tech (https://github.com/tech-conferences)
* https://frontendfront.com/conferences/ (https://github.com/frontendfront/front-end-conferences)
* https://codeandtalk.com/ (https://github.com/szabgab/codeandtalk.com)
* https://conferenceradar.com/ (https://github.com/conferenceradar/list)
* https://asciidisco.github.io/web-conferences-2018/ (https://github.com/asciidisco/web-conferences-2018)
* https://github.com/softwaremill/it-cfp-list

All of the sources follow a similar pattern of being community-maintained via Pull Requests.

While I must say that these each of these sources by itself is incredibly valuable, having them all available shows that there is still room for improvement.

One one hand, there are conferences that are listed across the board, which results in duplicated effort. I am not the first to notice this, and I believe the people responsible for the first four links have begun talks about this (see [here](https://github.com/tech-conferences/javascript-conferences/issues/36)), although without much current progress.

On the other hand, there are conferences listed in one resource but not in the others, meaning that taking any single list as the unique source of information does not meet my requirements.

Additionally, even combining all six different sources, I was still able to find interesting conferences that were not listed (e.g., [YOW! Lambda Jam 2018](http://lambdajam.yowconference.com.au/)).

Finally, all six sources store the data in different formats, provide different ways of accessing it programatically (some provide an API, for others you must fallback to the underlying git infrastructure), and present different kinds of front-ends, with different kinds of functionality.

## The Solution

![https://xkcd.com/927/](https://imgs.xkcd.com/comics/standards.png "https://xkcd.com/927/")

Attempting to avoid the above situation, I do not plan to create yet another _"send me your PR with the data I'm missing"_ github-based website.

The existing data is valuable, and the existing processes that create it shall not be disturbed. We will just consume it, and consolidate it.

The only challenge here is heuristically detecting duplicates, but I predict that simply matching the dates, names and locations will do. The resulting list will still be small enough (<1000) to be able to be reviewed manually.

If a duplicate is detected (either during creation or update), then we can keep the latest version, or drop it. We have no reason to trust either source more than another one, and they all might be wrong, so it would still make sense to eventually review the data manually.

The resulting data should be made accessible via an API, allowing a front-end to be developed.

This leaves only one problem left: Missing conferences.

The fact that even with all sources confereces are still missing should be enough evidence that the PR approach is not sufficient, and a different solution must be implemented.

While I have no knowledge of the current trends in AI, it is my gut feeling that it should be possible to identify conference-like events from current social media posts, as well as by parsing specific sources such as reddit or hacker news. The goal of this process is to automatically extract names of potential events.

A second process would consist of, given a potential event name, attempt to confirm if there is an upcoming instance of it or not, based on the assumption that an existing event will produce a specific kind of results over, say, google search.

The goal would be to fully automate this process, with minimum human oversight (moderation/validation).

An initial implementation could consist on just the framework for the process, allowing it to work in a completely way, just to have a work-around to quickly load missing events regardless.

In addition to the listed sources, which also contain data for previous years, these two links should also provide more potential event names:
* https://purelyfunctional.tv/functional-programming-conferences/
* https://medium.com/@FunctionalWorks/functional-programming-conference-calendar-e24bc799c908

## Next Steps

Since at the end of the day what I need is "the product", the goal is to work under an iterative, MVP approach focusing on getting the first workable version as soon as possible, being ready to throw away and rewrite significant parts of the code as the project moves along.

The stated solution is already split in various components:
* A scraper
* An aggregator
* An API server
* A frontend

For the initial version, the following interfaces will be adopted:

All components will be standalone applications. All components will consume input via stdin and generate output via stdout. Errors will be reported as non-zero exit codes.

Scrapers will fetch data from a specific source and output a list of parsed resources in YAML.

The aggregator will consume a list of resources in YAML and generate a consolidated list, taking care of deduplication/merging.

The API server will be mocked by statically hosting the final YAML list.

The frontend will be mocked by statically generating a Markdown document based on the YAML list.

A build component will be developed to orchestrate all the above processes together. At this stage, addition of new events will be mocked by manually generating scraper output by hand.

Initially, all components will be developed under this repository. This will change with time as the project takes shape.

# License

MIT
