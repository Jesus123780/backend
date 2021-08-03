const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const AreasModel = require('../../../models/areas/AreasModel')
const CitiesModel = require('../../../models/information/CitiesModel')
const colorModel = require('../../../models/information/color')
const CountriesModel = require('../../../models/information/CountriesModel')
const DepartmentsModel = require('../../../models/information/DepartmentsModel')
const productModel = require('../../../models/product/product')
const trademarkModel = require('../../../models/product/trademark')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const { deCode, getAttributes } = require('../../../utils')

// Mutations
const UpdateProductMutations = {
    updateProducts: async (_root, { input }) => {
        const { sizeId, colorId, cId, dId, ctId } = input
        try {
            const data = await productModel.create({
                ...input,
                pState: 1,
                sizeId: sizeId? deCode(sizeId) : null,
                colorId: colorId ? deCode(colorId) : null,
                cId:  cId ? deCode(cId) : null,
                dId:  dId ? deCode(dId) : null,
                ctId: ctId ? deCode(ctId) : null,
            })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
// Queries
const ProductQueries = {
    productsOne: async (root, { pId, cId, dId, ctId }, context, info) => {
        try {
            const attributes = getAttributes(productModel, info)
            const data = await productModel.findOne({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                        }
                    ]
                }
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno o No hay ningún producto registrado, Vuelve a intentarlo mas tarde ')
            return error
        }
    }, productsAll: async (root, { pId, cId, dId, ctId }, context, info) => {
        try {
            const attributes = getAttributes(productModel, info)
            const data = await productModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                            // ID adicional
                            cId: cId ? deCode(cId) : { [Op.gt]: 0 },
                            // ID departamento
                            dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // ID Cuidad
                            ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }, limit: [0, 25]
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}
// Types
const ProductTypes = {
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
        },
        color: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(colorModel, info)
                const data = await colorModel.findOne({
                    attributes,
                    where: { colorId: deCode(parent.colorId) }
                })
                return data
            } catch {
                return null
            }
        }
    }
}
module.exports = {
    ProductQueries,
    UpdateProductMutations,
    // Types
    ProductTypes,
}