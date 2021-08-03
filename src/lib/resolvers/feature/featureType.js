'use strict'
const { ApolloError } = require('apollo-server-errors')
const Feature = require('../../../models/feature/feature')
const Typefeature = require('../../../models/feature/TypFeature')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const featureQueries = {
    // eslint-disable-next-line
    features: async (_root) => {
        try {
            const data = await Feature.findAll({ attributes: ['fId', 'thpId', 'hpqrQuestion', 'hpqrState', 'hpqrDatCre', 'hpqrDatMod'] })
            if (data.length) return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
const FeatureTypes = {
    Feature: {
        typeFeature: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(Typefeature, info)
                const data = await Typefeature.findOne({
                    attributes,
                    where: { thpId: deCode(parent.thpId) }
                })
                return data
            } catch {
                return null
            }
        },
    }
}
module.exports = {
    featureQueries,
    FeatureTypes,
}