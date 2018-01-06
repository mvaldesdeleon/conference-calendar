const got = require('got')
const { map, filter, mapPromise, isArray } = require('../../utils')

//    isFile :: Object -> Boolean
const isFile = ({type}) =>
    type === 'file'

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
