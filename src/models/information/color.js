const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

// sequelize.sync()
const colorModel = sequelize.define('color', {
    colorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    colorName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    // CAMBIO DE ESTADO PARA BORRAR EL PRODUCTO
    colorState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    colorDatCre: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    colorDatMod: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = colorModel