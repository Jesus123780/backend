'use strict'
const { ApolloError } = require('apollo-server-errors')
const PQR = require('../../../models/PQR/PQR')
const TypePQR = require('../../../models/PQR/TypPQR')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const pqrQueries = {
    // eslint-disable-next-line
    pqr: async (_root) => {
        try {
            const data = await PQR.findAll({ attributes: ['hpqrId', /* Relación de Id con el tipo de PQR ----> */ 'thpId', 'hpqrQuestion', 'hpqrAnswer', 'hpqrState', 'hpqrDatCre', 'hpqrDatMod'] })

            if (data.length) return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
// Queries
const pqrTypeQueries = {
    // eslint-disable-next-line
    typopqr: async (_root,info) => {
        try {
            const res = await TypePQR.findAll({ attributes:[ 'thpId', 'thpName', 'thpIcon', 'thpState', 'thpDatCre', 'thpDatMod' ] })
            if (res.length) return res
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

/** *  Obtiene un pqr.
 * @param {Object} _root No usado
 * @param {Oject} input Entrada de datos
 * @param {Oject} args Argumentos
 * @return {Object} GQL response
 */
const pqrGetOneQueries = {
    getOnePqr: async (_root, args) => {
        try {
            const { hpqrId } = args
            const data = await TypePQR.findOne({
                attributes: ['thpId', 'thpName', 'thpIcon'],
                include: [{
                    attributes: ['hpqrId', 'hpqrQuestion', 'hpqrAnswer'],
                    model: PQR,
                    where: { hpqrId }
                }]
            })
            if (data) return data

            return 'No se ha encontrado ningún resultado.'
        } catch (e) {
            throw new ApolloError('Algo ha salido mal, intenta nuevamente.', 500, e)
        }
    }
}

// Mutations
const createPqrMutations = {
    createPqr: async (_root, { input }) => {
        try {
            const data = await PQR.create({ ...input })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

// Types
const pqrTypes = {
    PQR: {
        typepqr: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(TypePQR, info)
                const data = await TypePQR.findOne({
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
    // Busca a todos los PQR
    pqrQueries,
    // Buscamos todos los tipos
    pqrGetOneQueries,
    // Mutación para crear un PQR
    createPqrMutations,
    pqrTypes,
    pqrTypeQueries,
}