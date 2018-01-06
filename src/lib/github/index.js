/*
Scraper: Basic Github scraping module.

Features:
Process file at specified path.
List all files at a specified path, and process them.

Processed files might be:
JSON (Array & Object)
Markdown (Ad-hoc)

*/

const got = require('got')
const { map, filter, mapPromise } = require('../../utils')

//    isFile :: Object -> Boolean
const isFile = ({type}) =>
    type === 'file'

const isArray = value =>
    value instanceof Array

//    validate :: (a -> Boolean) -> String -> a -> Promise ({String}, a)
const validate = condition => message => value =>
    condition (value) ? Promise.resolve(value) : Promise.reject({message})

//    getBody :: Object -> Object
const getBody = ({body}) =>
    body

//	  getContents :: String -> String -> String -> Promise (Object, a)
const getContents = owner => repo => path =>
    got (`http://api.github.com/repos/${owner}/${repo}/contents/${path}`, {json: true})
        .then (getBody)

//    downloadFile = Object -> Promise (Object, String)
const downloadFile = ({download_url}) =>
    got (download_url)
        .then (getBody)

//    getFile :: String -> String -> String -> (String -> a) -> Promise (Object, a)
const getFile = owner => repo => path => processor =>
    getContents (owner) (repo) (path)
        .then (validate (isFile) ('Path does not point to a file'))
        .then (downloadFile)
        .then (processor)

//    getFiles :: String -> String -> String -> (String -> a) -> Promise (Object, [a])
const getFiles = owner => repo => path => processor =>
    getContents (owner) (repo) (path)
        .then (validate (isArray) ('Path does not point to a directory'))
        .then (filter (isFile))
        .then (mapPromise (downloadFile))
        .then (map (processor))

module.exports =
    { getFile, getFiles }
