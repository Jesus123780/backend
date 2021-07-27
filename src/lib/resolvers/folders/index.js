const { Op } = require('sequelize')
const FoldersModel = require('../../../models/folders/FoldersModel')
const { deCode, getAttributes } = require('../../../utils')

// Queries
const folderQueries = {
    // Queries
    folders: async (root, args, context, resolveInfo) => {
        try {
            const { state, level, id } = args?.input || {}
            const attributes = getAttributes(FoldersModel, resolveInfo)
            const data = await FoldersModel.findAll({ attributes,
                where: {
                    fLevel: level ? level : { [Op.gte]: 0 },
                    fState: state ? state : { [Op.gte]: 0 },
                    uId: id ? deCode(id) : { [Op.gte]: 0 }
                }
            })
            return data
        } catch (e) {
            return e
        }
    },

}
// Mutations
const folderMutation = {
    setFolder: async (root, { input }) => {
        try {
            const data = await FoldersModel.create({ ...input, fState: 1 })
            return { ...input, fId: data.fId }
        } catch (e) {
            return e
        }
    }
}

module.exports = {
    folderQueries,
    folderMutation
}