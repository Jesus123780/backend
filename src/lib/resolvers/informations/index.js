const { citiesQueries } = require('./Cities')
const { countriesQueries } = require('./Countries')
const { departmentsQueries } = require('./Departments')
const { typeIdentitiesQueries, typeIdentitiesMutation } = require('./TypeIdentities')

const informationQueries = {
    ...countriesQueries,
    ...departmentsQueries,
    ...citiesQueries,
    ...typeIdentitiesQueries,
}
const informationMutation = {
    ...typeIdentitiesMutation
}

module.exports = {
    informationQueries,
    informationMutation,
}