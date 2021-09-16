'use strict'

const { dateTimeScalar } = require('./resolvers/CustomScalar')
const queries = require('./resolvers/queries')
const mutations = require('./resolvers/mutations')
const types = require('./resolvers/types')
const { SubscriptionSubscription } = require('./resolvers/Messages')
// const { GraphQLUpload } = require('graphql-upload')

module.exports = {
    Query: {
        ...queries
    },
    Mutation: {
        ...mutations,
    },
    Subscription: {
        ...SubscriptionSubscription.Subscription,
    },
    DateTime: dateTimeScalar,
    ...types,
}