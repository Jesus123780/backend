const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const TypePQRArea = require('./TypPQRArea')

// sequelize.sync()

const TypePQR = sequelize.define('typepqr', {
    thpId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    areaPqrId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: TypePQRArea,
            key: 'areaPqrId'
        },
        get (x) { return enCode(this.getDataValue(x)) },
        set (x) { this.setDataValue('thpId', validationID(x)) }
    },
    thpName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    thpIcon: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 1
    },
    thpState: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 1
    },
    thpDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    thpDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = TypePQR