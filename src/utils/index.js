const map = fn => array =>
    array.map(x => fn(x))

const filter = pr => array =>
    array.filter(x => pr(x))

const awaitAll = Promise.all.bind(Promise)

const mapPromise = fn => array =>
    awaitAll (map (fn) (array))

const concat = arrayA => arrayB => [].concat(arrayA, arrayB)

const flatten = arrays => [].concat(...arrays)

module.exports =
    { map, filter, awaitAll, mapPromise, concat, flatten }
