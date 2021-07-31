const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const Products = require('../product/product')
const GeneralFoldersModel = require('./GeneralFoldersModel')

const GeneralDocumentsModel = sequelize.define('generaldocuments',
    {
        gdId: {
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
                model: Products,
                key: 'pId'
            },
            get(x) { return enCode(this.getDataValue(x)) },
            set(x) { return this.setDataValue('pId', validationID(x, false))}
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
            set(x) { return this.setDataValue('gfId', validationID(x, false)) }
        },
        gdName: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        gdSecNam: {
            type: Sequelize.STRING(50)
        },
        gdState: {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        gdDatCre: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        gdDatMod: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },
    {
        timestamps: false
    }
)

module.exports = GeneralDocumentsModel