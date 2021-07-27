'use strict'
const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const ProductsModel = require('../../../models/products/products')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const AreasModel = require('../../../models/featuresProducts/AreasModel')
const { deCode, getAttributes, filterKeyObject, linkBelongsTo } = require('../../../utils')
const CountriesModel = require('../../../models/information/CountriesModel')
const CitiesModel = require('../../../models/information/CitiesModel')
const DepartmentsModel = require('../../../models/information/DepartmentsModel')
const trademarkModel = require('../../../models/Products/trademark')

// Queries
const clientsQueries = {
    products: async (root, { umId, ProState }, context, info) => {
        try {
            linkBelongsTo(ProductsModel, ThirdPartiesModel, 'tpId', 'tpId')
            const attributes = getAttributes(ProductsModel, info)
            const data = await ProductsModel.findAll({
                attributes,
                include: [
                    {
                        attributes: ['tpId', 'umId'],
                        model: ThirdPartiesModel,
                        where: { umId: deCode(umId) },
                        required: true
                    }
                ],
                where: { ProState: ProState ? ProState : { [Op.gt]: 0 } }
            })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    },
    productsOne: async (root, { pId, tpId, cId, dId, ctId }, context, info) => {
        try {
            const attributes = getAttributes(ProductsModel, info)
            const data = await ProductsModel.findOne({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                            // ID adicional
                            tpId: tpId ? deCode(tpId) : { [Op.gt]: 0 },
                            // ID País
                            cId: cId ? deCode(cId) : { [Op.gt]: 0 },
                            // ID departamento
                            dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // ID Cuidad
                            ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno o No hay ningún producto registrado, Vuelve a intentarlo mas tarde ')
            return error
        }
    }, productsAll: async (root, { pId, tpId, cId, dId, ctId }, context, info) => {
        try {
            const attributes = getAttributes(ProductsModel, info)
            const data = await ProductsModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                            // ID adicional
                            tpId: tpId ? deCode(tpId) : { [Op.gt]: 0 },
                            // ID País
                            cId: cId ? deCode(cId) : { [Op.gt]: 0 },
                            // ID departamento
                            dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // ID Cuidad
                            ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}

// Mutations
const clientsMutations = {
    setClient: async (_root, { input }) => {
        try {
            const { tpId, pId } = input || {}

            if (pId) {
                const fields = filterKeyObject(input, ['pId', '__typename'])
                await ProductsModel.update(
                    { ...fields },
                    { where: { pId: deCode(pId) } }
                )
                return { ...input }
            } else {
                const isClientExist = await ProductsModel.findOne({
                    attributes: ['pId', 'ProState'],
                    where: { tpId: deCode(tpId) }
                })
                if (isClientExist?.ProState?.toString() === '0') {
                    await ProductsModel.update({ ...input, ProState: 1 }, { where: { pId: deCode(isClientExist.pId) } })
                    return { ...input, pId: isClientExist.pId }
                }
                else if (isClientExist) throw new Error('El cliente ya se encuentra registrado.')

                const data = await ProductsModel.create({
                    ProState: 1,
                    tpId,
                    ...input
                })
                return { ...input, pId: data.pId }
            }
        } catch (e) {
            throw new ApolloError(e.message)
        }
    }
}

// Types
const clientsTypes = {
    Product: {
        thirdParties: async parent => {
            try {
                const res = await ThirdPartiesModel.findOne({
                    attributes: [
                        'tpId',
                        'umId',
                        'tpNumDoc',
                        'tpName',
                        'tpLasNam',
                        'tpPhone',
                        'tpEmail',
                        'tpState'
                    ],
                    where: { tpId: deCode(parent.tpId) }
                })
                return res
            } catch (error) {
                return null
            }
        },
        features: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(AreasModel, info)
                const data = await AreasModel.findAll({
                    attributes,
                    where: { pId: deCode(parent.pId) }
                })
                return data
            } catch {
                return null
            }
        },
        pais: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(CountriesModel, info)
                const data = await CountriesModel.findOne({
                    attributes,
                    where: { cId: deCode(parent.cId) }
                })
                return data
            } catch {
                return null
            }
        },
        department: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(DepartmentsModel, info)
                const data = await DepartmentsModel.findOne({
                    attributes,
                    where: { dId: deCode(parent.dId) }
                })
                return data
            } catch {
                return null
            }
        },
        city: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(CitiesModel, info)
                const data = await CitiesModel.findOne({
                    attributes,
                    where: { ctId: deCode(parent.ctId) }
                })
                return data
            } catch {
                return null
            }
        },
        mark: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(trademarkModel, info)
                const data = await trademarkModel.findOne({
                    attributes,
                    where: { tId: deCode(parent.tId) }
                })
                return data
            } catch {
                return null
            }
        }
    }
}
module.exports = {
    clientsQueries,
    clientsMutations,
    clientsTypes
}