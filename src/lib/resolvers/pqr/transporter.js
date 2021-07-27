const { pqrQueries, pqrTypes, pqrTypesQueries, pqrGetOneQueries, pqrTypeQueries } = require('.')

const pqrQueriesT = {
    ...pqrQueries,
    ...pqrGetOneQueries,
    ...pqrTypeQueries,
}
const pqrQueriesType = {
    ...pqrTypes,
    ...pqrTypesQueries,
}

module.exports = {
    pqrQueriesT,
    pqrQueriesType
}