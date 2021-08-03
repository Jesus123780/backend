'use strict'

const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const ProductsModel = require('../product/product')
const AreasModel = require('../areas/AreasModel')

const GeneralFoldersModel = sequelize.define('generalfolders', {
    gfId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    pId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: ProductsModel,
            key: 'pId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('pId', validationID(x, false)) }
    },
    aId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: AreasModel,
            key: 'aId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('aId', validationID(x, false)) }
    },
    gfName: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: 'New Folder'
    },
    gfLevel: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        defaultValue: 1,
    },
    gfState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    gfDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    gfDatMod: {
        type:'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = GeneralFoldersModel