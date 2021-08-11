'use strict'
const { ApolloError } = require('apollo-server-errors')
const Typefeature = require('../../../models/feature/TypFeature')
// const { getAttributes, deCode } = require('../../../utils')

// Queries
const featureTypeQueries = {
    // eslint-disable-next-line
    typeFeatures: async (_root, info, { thpId }) => {
        try {
            const data = await Typefeature.findAll({ attributes: ['thpId', 'thpName', 'thpIcon'] })
            if (data.length) return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
// const FeatureTypes = {
//     Feature: {
//         typeFeature: async (parent, _args, _context, info) => {
//             try {
//                 const attributes = getAttributes(Typefeature, info)
//                 const data = await Typefeature.findOne({
//                     attributes,
//                     where: { thpId: deCode(parent.thpId) }
//                 })
//                 return data
//             } catch (e) {
//                 throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
//             }
//         },
//     }
// }
// Mutations
const createFeatureTypeMutations = {
    createFeatureType: async (_root, { input }) => {
        try {
            const data = await Typefeature.create({ ...input })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
module.exports = {
    // FeatureTypes,
    featureTypeQueries,
    createFeatureTypeMutations,
}