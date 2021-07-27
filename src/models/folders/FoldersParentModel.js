const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const {deCode, validationID} = require('../../utils')
const FoldersModel = require('./FoldersModel')
// sequelize.sync()

const FolderParentsModel = sequelize.define('folderParents', {
    fpId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    fId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: FoldersModel,
            key: 'fId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('fId', validationID(x, false))}
    },
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: FoldersModel,
            key: 'fId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('parentId', validationID(x, false))}
    },
    fpLevel: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fpState: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    fpDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    fpDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = FolderParentsModel