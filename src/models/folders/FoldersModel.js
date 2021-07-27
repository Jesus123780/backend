const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const {validationID, enCode} = require('../../utils')
const UsersModel = require('../users/UsersModel')
// sequelize.sync()

const FoldersModel = sequelize.define('folders', {
    fId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    uId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: UsersModel,
            key: 'uId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('uId', validationID(x, false))}
    },
    fName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    fLevel: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    fState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    fDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    fDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = FoldersModel