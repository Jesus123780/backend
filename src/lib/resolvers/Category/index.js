const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const AreasModel = require('../../../models/areas/AreasModel')
const CategoryProductsModel = require('../../../models/Categories/CategoryProducts')
const Feature = require('../../../models/feature/feature')
const CitiesModel = require('../../../models/information/CitiesModel')
const colorModel = require('../../../models/information/color')
const CountriesModel = require('../../../models/information/CountriesModel')
const DepartmentsModel = require('../../../models/information/DepartmentsModel')
const trademarkModel = require('../../../models/product/trademark')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const { deCode, getAttributes } = require('../../../utils')

// Mutations
const UpdateCategoriesMutations = {
    updateCategoryProducts: async (_root, { input }) => {
        const { caId, cpState } = input
        try {
            if (!caId) {
                const data = await CategoryProductsModel.create({
                    ...input,
                    cpState: 1,
                })
                return data
            }
            else {
                const isExist = await CategoryProductsModel.findOne({ attributes: ['caId', 'cpName', 'cpState'], where: { caId: deCode(caId) } })
                if (isExist) {
                    await CategoryProductsModel.update({ cpState: cpState === 1 ? 0 : 1 }, { where: { caId: deCode(caId) } })
                }
                else {
                    throw new ApolloError('No se pudo eliminar el producto debido a un error interno.')
                }
            }
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
// Queries
const CategoriesProductQueries = {
    CategoryProductsOne: async (root, { caId }, context, info) => {
        try {
            const attributes = getAttributes(CategoryProductsModel, info)
            const data = await CategoryProductsModel.findOne({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            // ID Categories
                            caId: caId ? deCode(caId) : { [Op.gt]: 0 },
                        }
                    ]
                }
            })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno o No hay ningún producto registrado, Vuelve a intentarlo mas tarde ')
            return error
        }
    }, CategoryProductsAll: async (root, args, context, info) => {
        try {
            const { search, min, max, caId } = args
            let whereSearch = {}
            if (search) {
                whereSearch = {
                    [Op.or]: [
                        { cpName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                    ]
                }
            }
            const attributes = getAttributes(CategoryProductsModel, info)
            const data = await CategoryProductsModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            ...whereSearch,
                            // ID Productos
                            caId: caId ? deCode(caId) : { [Op.gt]: 0 },
                            cpState: { [Op.gt]: 0 }
                            // // ID departamento
                            // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
                            // // ID Cuidad
                            // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
                        }
                    ]
                }, limit: [min || 0, max || 100], order: [['cpName', 'ASC']]
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
                        'tcId',
                        'umId',
                        'tpNumDoc',
                        'tpName',
                        'tpLasNam',
                        'tpPhone',
                        'tpEmail',
                        'tpState'
                    ],
                    where: { tcId: deCode(parent.tcId) }
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
                    where: { caId: deCode(parent.caId) }
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
                    where: { caId: deCode(parent.caId) }
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
    CategoriesProductQueries,
    UpdateCategoriesMutations,
    // Types
    ProductTypes,
}