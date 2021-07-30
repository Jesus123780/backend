'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const TypeRoad = require('../../../models/information/TypeOfRoad')
const { deCode, getAttributes, filterKeyObject } = require('../../../utils')

// Queries
const roadQueries = {
    // eslint-disable-next-line
    road: async (_root, args, { input }, info) => {
        try {
            const attributes = getAttributes(TypeRoad, info)
            const data = await TypeRoad.findAll({ attributes, where: { rState: { [Op.gt]: 0 } }, order: [['rName', 'DESC']] })
            return data

        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
// Mutations
const createRoadMutation = {
    createRoad: async (_root, { input }) => {
        console.log(input)
        try {
            const data = await TypeRoad.create({ ...input })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
/**
 * Edita un Road.
 * @param {Object} _ No usado
 * @param {Oject} args Argumentos de la petición
 * @return {Object} GQL response
 * @param {Object} _ Not used
 * @param {Object} args request params
 * @param {Object} context contexto
 * @param {Object} info información
 * @return {Object} data
 * @version 1.0
 * @author Jesus Juvinao
 */
const editRoad = {
    editRoad: async (_root, { input }) => {
        const { rId, rName, rState } = input
        try {
            /** Editar el registro del país */
            const data = await TypeRoad.update({ rName, rState }, { where: { rId: deCode(rId) } })
            const result = await TypeRoad.findOne({ ...filterKeyObject(input, ['rId']) }, { where: { rId: deCode(rId) } })
            if (data !== null) return result
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

module.exports = {
    roadQueries,
    editRoad,
    createRoadMutation,
}