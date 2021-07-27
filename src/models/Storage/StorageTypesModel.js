const Sequelize = require('sequelize')
const connect = require('../database')
const { enCode } = require('../../utils')
const sequelize = connect()

const StorageTypesModel = sequelize.define('storagetypes', {
    stId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    stName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    stState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    stDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    stDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = StorageTypesModel