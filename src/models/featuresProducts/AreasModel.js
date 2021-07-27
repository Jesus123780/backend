const Sequelize = require('sequelize')
const connect = require('../database')
const ProductsModel = require('../products/products')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')

const AreasModel = sequelize.define('areas', {
    aId: {
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
    aName: {
        type: Sequelize.STRING(120),
        allowNull: false
    },
    aState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    aDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    aDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = AreasModel