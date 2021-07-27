const Sequelize = require('sequelize')
const connect = require('../database')
const { enCode, validationID } = require('../../utils')
const CitiesModel = require('../information/CitiesModel')
const CountriesModel = require('../information/CountriesModel')
const TypeIdentitiesModel = require('../information/TypeIdentitiesModel')
const DepartmentsModel = require('../information/DepartmentsModel')
const sequelize = connect()

// sequelize.sync()

const ThirdPartiesModel = sequelize.define('thirdparties', {
    tpId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: CountriesModel,
            key: 'cId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('countryId', validationID(x, false))}
    },
    dId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: DepartmentsModel,
            key: 'dId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('dId', validationID(x, false))}
    },
    ctId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: CitiesModel,
            key: 'ctId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('cId', validationID(x, false))}
    },
    tiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: TypeIdentitiesModel,
            key: 'tiId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('tiId', validationID(x, false))}
    },
    tpNitDV: {
        type: Sequelize.STRING(2),
        allowNull: true,
    },
    tpNumDoc: {
        type: Sequelize.STRING(15),
        allowNull: false,
        // unique: true
    },
    tpName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    tpLasNam: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    tpPhone: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    tpEmail: {
        type: Sequelize.STRING(100),
        allowNull: false,
        // unique: true
    },
    tpDir: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    tpState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    tpDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    tpDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = ThirdPartiesModel