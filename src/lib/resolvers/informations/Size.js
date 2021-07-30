'use strict'

const { ApolloError } = require('apollo-server')
const SizeModel = require('../../../models/information/size')

// Queries
const sizeQueries = {
    // eslint-disable-next-line
    getSizes: async (_root, _context, _info) => {
        try {
            const data = await SizeModel.findAll({ attributes:[ 'sizeId', 'sizeName', 'sizeState' ] })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

const sizeMutation = {
    // eslint-disable-next-line
    create: async (_root,  { input }, _context, _info) => {
        console.log(input)
        try {
            const res = await SizeModel.create({ ...input })
            return res
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

module.exports = {
    sizeQueries,
    sizeMutation
}