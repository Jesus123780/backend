const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const GeneralFoldersModel = require('./GeneralFoldersModel')

const GeneralFoldersParentsModel = sequelize.define('generalFoldersParents', {
    gfpId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    gfId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: GeneralFoldersModel,
            key: 'gfId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('gfId', validationID(x, false)) }
    },
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: GeneralFoldersModel,
            key: 'gfId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('parentId', validationID(x, false)) }
    },
    gfpLevel: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        defaultValue: 1
    },
    gfpState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    gfpDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    gfpDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = GeneralFoldersParentsModel