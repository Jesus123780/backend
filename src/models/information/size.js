const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

// sequelize.sync()

const SizeModel = sequelize.define('sizes', {
    sizeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    sizeName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    sizeState: {
        type: Sequelize.SMALLINT,
        defaultValue: 1,
        allowNull: true
    },
    DatCre: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    DatMod: {
        type: Sequelize.DATE,
        default: Date.now()
    }
}, {
    timestamps: false,
})

module.exports = SizeModel