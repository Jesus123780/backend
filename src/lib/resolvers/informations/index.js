const { citiesQueries } = require('./Cities')
const { countriesQueries } = require('./Countries')
const { departmentsQueries } = require('./Departments')
const { sizeQueries } = require('./Size')
const { typeIdentitiesQueries, typeIdentitiesMutation } = require('./TypeIdentities')

const informationQueries = {
    ...countriesQueries,
    ...departmentsQueries,
    ...citiesQueries,
    ...typeIdentitiesQueries,
    ...sizeQueries,
}
const informationMutation = {
    ...typeIdentitiesMutation
}

module.exports = {
    informationQueries,
    informationMutation,
}