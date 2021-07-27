'use strict'

const { dateTimeScalar } = require('./resolvers/CustomScalar')
const queries = require('./resolvers/queries')
const mutations = require('./resolvers/mutations')
const types = require('./resolvers/types')
// const { GraphQLUpload } = require('graphql-upload')

module.exports = {
    Query: queries,
    Mutation: mutations,
    DateTime: dateTimeScalar,
    // Upload: GraphQLUpload,
    ...types
}