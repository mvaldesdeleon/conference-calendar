const map = fn => array =>
    array.map(x => fn(x))

const filter = pr => array =>
    array.filter(x => pr(x))

const awaitAll = Promise.all.bind(Promise)

const mapPromise = fn => array =>
    awaitAll (map (fn) (array))

const concat = arrayA => arrayB => [].concat(arrayA, arrayB)

const flatten = arrays => [].concat(...arrays)

const removeUndefinedFields = object =>
    Object.keys (object)
        .reduce (((clone, key) => Object.assign(clone, object[key] !== undefined ? {[key]: object[key]} : {})), {})

const print = text =>
    process.stdout.write (text)

const error = ({message}) =>
    (process.stderr.write (`${message}`), process.exitCode = -1, Promise.resolve ())

const run = run =>
    run ()
        .then(print)
        .catch(error)

module.exports =
    { map, filter, awaitAll, mapPromise, concat, flatten, removeUndefinedFields, run }
