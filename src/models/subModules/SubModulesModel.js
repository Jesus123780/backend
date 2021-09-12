const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const ModulesModel = require('../modules/ModulesModel')

const SubModulesModel = sequelize.define('submodules', {
    smId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    mId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: ModulesModel,
            key: 'mId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('mId', validationID(x, false))}
    },
    smName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    smPath: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    smPriority: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    smState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    smDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    smDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = SubModulesModel