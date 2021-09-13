const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const AreasModel = require('../../../models/areas/AreasModel')
const Feature = require('../../../models/feature/feature')
const CitiesModel = require('../../../models/information/CitiesModel')
const colorModel = require('../../../models/information/color')
const CountriesModel = require('../../../models/information/CountriesModel')
const DepartmentsModel = require('../../../models/information/DepartmentsModel')
const productModel = require('../../../models/product/product')
const trademarkModel = require('../../../models/product/trademark')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const { deCode, getAttributes } = require('../../../utils')

// Mutations
/** */
const UpdateProductMutations = {
    updateProducts: async (_root, { input }) => {
        const { sizeId, colorId, cId, dId, ctId, pId, pState } = input
        try {
            if (!pId) {
                const data = await productModel.create({
                    ...input,
                    pState: 1,
                    sTateLogistic: 1,
                    sizeId: sizeId? deCode(sizeId) : null,
                    colorId: colorId ? deCode(colorId) : null,
                    cId:  cId ? deCode(cId) : null,
                    dId:  dId ? deCode(dId) : null,
                    ctId: ctId ? deCode(ctId) : null,
                })
                return data
            }
            else {
                const isExist = await productModel.findOne({ attributes: ['pId', 'pName', 'pState', 'sTateLogistic'], where: { pId: deCode(pId) } })
                if (isExist) {
                    await productModel.update({ pState: pState === 1 ? 0 : 1 }, { where: { pId: deCode(pId) } })
                }
                else {
                    throw new ApolloError('No se pudo eliminar el producto debido a un error interno.')
                }
            }
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    },
    // Elimina el producto despues de que el estado pState pasa a ser 0
    deleteProducts: async (_root, { input }) => {
        const { pId } = input
        const isExist = await productModel.findOne({ attributes: ['pId', 'pName', 'pState'], where: { pId: deCode(pId) } })
        if (isExist) {
            await productModel.destroy({
                where: { pId: deCode(pId) }
            })
        } else {
            throw new ApolloError('El producto no existe, No ha sido posible procesar su solicitud.')
        }
    }
}
// Queries
const ProductQueries = {
    productsOne: async (root, { pId }, context, info) => {
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
            const error = new Error('Lo sentimos, ha ocurrido un error interno o el producto no esta  registrado, Vuelve a intentarlo mas tarde.')
            return error
        }
    }, productsAll: async (root, args, context, info) => {
        try {
            const { search, min, max, pId, gender, desc, categories } = args
            let whereSearch = {}
            if (search) {
                whereSearch = {
                    [Op.or]: [
                        { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                        { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                        { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                        { ProDelivery: { [Op.substring]: search.replace(/\s+/g, ' ') } }
                    ]
                }
            }
            if (gender?.length) {
                whereSearch = {
                    ...whereSearch,
                    ProDelivery: { [Op.in]: gender.map(x => x)
                    }
                }
            }
            if (desc?.length) {
                whereSearch = {
                    ...whereSearch,
                    ProDescuento: { [Op.in]: desc.map(x => x) }
                }
            }
            //validad que  venga una categoría para hacer el filtro por categorías
            if (categories?.length) {
                whereSearch = {
                    ...whereSearch,
                    caId: { [Op.in]: categories.map(x => deCode(x)) }
                }
            }
            const attributes = getAttributes(productModel, info)
            const data = await productModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            ...whereSearch,
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                            pState: { [Op.gt]: 0 }
                            // // ID departamento
                            // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // // ID Cuidad
                            // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }, limit: [min || 0, max || 100], order: [['pName', 'DESC']]
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    },
    productsLogis: async (root, args, context, info) => {
        try {
            const { search, min, max, pId } = args
            let whereSearch = {}
            if (search) {
                whereSearch = {
                    [Op.or]: [
                        { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                        { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                        { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } }
                    ]
                }
            }
            const attributes = getAttributes(productModel, info)
            const data = await productModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            ...whereSearch,
                            // ID Productos
                            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
                            pState: 0
                            // // ID departamento
                            // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // // ID Cuidad
                            // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }, limit: [min || 0, max || 100], order: [['pName', 'ASC']]
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    },
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
        area: async (parent, _args, _context, info) => {
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
        feat: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(Feature, info)
                const data = await Feature.findAll({
                    attributes,
                    where: { fId: deCode(parent.fId) }
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