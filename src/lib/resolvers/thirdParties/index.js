'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const ProductsModel = require('../../../models/product/product')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const { getAttributes, deCode, filterKeyObject } = require('../../../utils')

// Queries
const thirdPartiesQueries = {
    thirdParties: async (root, { umId }, context, info) => {
        try {
            const attributes = getAttributes(ThirdPartiesModel, info)
            const data = ThirdPartiesModel.findAll({ attributes, where: { tpState: { [Op.gt]: 0 }, umId: deCode(umId) } })
            return data
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    },
    searchThirdParties: async (root, { tpNumDoc }, context, info) => {
        try {
            let clientExist = false
            const attributes = getAttributes(ThirdPartiesModel, info)
            const dataThird = await ThirdPartiesModel.findOne({ attributes, where: { tpNumDoc } })
            if (dataThird) clientExist = await ProductsModel.findOne({ attributes: ['tpId'], where: { tpId: deCode(dataThird.tpId) } })

            if (clientExist) throw new Error('El Cliente ya se encuentra registrado', 405)

            return dataThird
        } catch (e) {
            throw new ApolloError(e?.message || 'Lo sentimos, ha ocurrido un error interno', 405)
        }

    }
}

// Mutations
const thirdPartiesMutations = {
    createThirdParties: async (root, { input }) => {
        try {
            if (input.tpId) {
                const values = filterKeyObject(input, ['tpId', '__typename'])
                await ThirdPartiesModel.update({ ...values }, { where: { tpId: deCode(input.tpId) } })
                return { ...input }

            } else {
                const isExist = await ThirdPartiesModel.findOne({
                    attributes: ['tpId', 'tpState'],
                    where: {
                        umId: deCode(input.umId),
                        [Op.or]: [
                            { tpNumDoc: input.tpNumDoc },
                            { tpEmail: input.tpEmail },
                        ]
                    }
                })

                if (isExist?.tpState?.toString() === '0') {
                    await ThirdPartiesModel.update({ ...input, tpState: 1 }, { where: { tpId: deCode(isExist.tpId) } })
                    return { ...input, tpId: isExist.tpId }
                }
                else if (isExist) throw new ApolloError('El número de Identificación o correo ya está registrado', 409)

                const data = await ThirdPartiesModel.create({ ...input, tpState: 1 })
                return { ...input, tpId: data.tpId }
            }
        } catch (e) {
            console.log(e)
            return new ApolloError(e?.message || 'Lo sentimos, ha ocurrido un error interno')
        }
    }
}

module.exports = {
    thirdPartiesQueries,
    thirdPartiesMutations
}