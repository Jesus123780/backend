const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

const CountriesModel = sequelize.define('countries', {
    cId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    cName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    cCalCod: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    cState: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 1
    },
    cDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    },
    cDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true
    }
}, {
    timestamps: false,
})

module.exports = CountriesModel