const Sequelize = require('sequelize')
const connect = require('../database')
const AreasModel = require('../areas/AreasModel')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')

const RequirementsModel = sequelize.define('requirements', {
    rId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    aId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: AreasModel,
            key: 'aId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('aId', validationID(x, false)) }
    },
    rPriority: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    rName: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    rAcronym: {
        type: Sequelize.STRING(15),
        allowNull: false
    },
    rQuality: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    rDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    rDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = RequirementsModel