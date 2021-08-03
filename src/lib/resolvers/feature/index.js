'use strict'
const { ApolloError } = require('apollo-server-errors')
const { decode } = require('js-base64')
const Feature = require('../../../models/feature/feature')
const Typefeature = require('../../../models/feature/TypFeature')
const { getAttributes, deCode } = require('../../../utils')
// const PQR = require('../../../models/PQR/PQR')
// const TypePQR = require('../../../models/PQR/TypPQR')
// const { getAttributes, deCode } = require('../../../utils')

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
// Mutations
const createFeatureMutations = {
    createFeature: async (_root, { input }) => {
        const { thpId, hpqrQuestion } = input
        console.log(input)
        try {
            const data = await Typefeature.create({
                thpId:  thpId ? deCode(thpId) : null,
                hpqrQuestion
            })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

// Types
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
    createFeatureMutations,
}