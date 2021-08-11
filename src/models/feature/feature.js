const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const Typefeature = require('./TypFeature')

// sequelize.sync()

const Feature = sequelize.define('feature', {
    fId: {
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
            model: Typefeature,
            key: 'thpId'
        },
        get (x) { return enCode(this.getDataValue(x)) },
        set(x) { return this.setDataValue('thpId', validationID(x, false))}
    },
    hpqrQuestion: {
        type: Sequelize.STRING(120),
        allowNull: false
    },
    hpqrState: {
        type: Sequelize.SMALLINT,
        allowNull: false
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

module.exports = Feature;