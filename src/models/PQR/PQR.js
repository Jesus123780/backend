const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const TypePQR = require('./TypPQR')

// sequelize.sync()

const PQR = sequelize.define('PQR', {
    hpqrId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    thpId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: TypePQR,
            key: 'thpId'
        },
        get (x) { return enCode(this.getDataValue(x)) },
        set (x) { this.setDataValue('thpId', validationID(x)) }
    },
    hpqrQuestion: {
        type: Sequelize.STRING(120),
        allowNull: false
    },

    hpqrAnswer: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    hpqrState: {
        type: Sequelize.SMALLINT,
        allowNull: true,
        defaultValue: 1
    },

    hpqrDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },

    hpqrDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = PQR