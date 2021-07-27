const Sequelize = require('sequelize')
const connect = require('../database')
const UserMastersModel = require('../users/userMasterModel')
const { enCode, validationID } = require('../../utils')
const StorageTypesModel = require('./StorageTypesModel')
const sequelize = connect()

const StorageModel = sequelize.define('storage', {
    sId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    umId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: UserMastersModel,
            key: 'umId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('umId', validationID(x, false))}
    },
    stId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: StorageTypesModel,
            key: 'stId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('stId', validationID(x, false))}
    },
    sName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    sRegion: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    sAccessKeyId: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    sSecretAccessKey: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    sState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    sDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    sDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = StorageModel