const Sequelize = require('sequelize')
const connect = require('../database')
const AreasModel = require('../areas/AreasModel')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const ThirdPartiesModel = require('../thirdParties/ThirdPartiesModel')

const EmployeesModel = sequelize.define('employees', {
    eId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
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
    tpId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: ThirdPartiesModel,
            key: 'tpId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('tpId', validationID(x, false)) }
    },
    eEnterprise: {
        type: Sequelize.STRING(150),
    },
    eSalary: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    eCharge: {
        type: Sequelize.STRING(50),
    },
    typeContract: {
        type: Sequelize.STRING(50),
    },
    termContract: {
        type: Sequelize.STRING(50),
    },
    eDatAdm: {
        type: Sequelize.DATE,
        allowNull: false
    },
    eDatRet: {
        type: Sequelize.DATE,
    },
    eArl: {
        type: Sequelize.STRING(100),
    },
    eBoxComp: {
        type: Sequelize.STRING(100),
    },
    eState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    eDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    eDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = EmployeesModel