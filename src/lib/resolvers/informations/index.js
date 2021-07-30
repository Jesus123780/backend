const { citiesQueries } = require('./Cities')
const { countriesQueries } = require('./Countries')
const { departmentsQueries } = require('./Departments')
const { roadQueries, editRoad } = require('./RoadType')
const { sizeQueries } = require('./Size')
const { typeIdentitiesQueries, typeIdentitiesMutation } = require('./TypeIdentities')

const informationQueries = {
    ...countriesQueries,
    ...departmentsQueries,
    ...citiesQueries,
    ...typeIdentitiesQueries,
    ...sizeQueries,
    ...roadQueries,
}
const informationMutation = {
    ...typeIdentitiesMutation,
    ...editRoad,
}

module.exports = {
    informationQueries,
    informationMutation,
}