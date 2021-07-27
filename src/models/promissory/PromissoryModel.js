const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { validationID, enCode } = require('../../utils')
const FoldersModel = require('../folders/FoldersModel')
const ThirdPartiesModel = require('../thirdParties/ThirdPartiesModel')
const DocumentsLocationModel = require('../documentsLocation/DocumentsLocationModel')

const PromissoryModel = sequelize.define('promissorynotes', {
    pnId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) },
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
    fId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: FoldersModel,
            key: 'fId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('fId', validationID(x, false)) }
    },
    dlId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: DocumentsLocationModel,
            key: 'dlId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('dlId', validationID(x, false)) }
    },
    pnNum: {
        type: Sequelize.INTEGER(100),
        allowNull: false,
        unique: true
    },
    pnObs: {
        type: Sequelize.STRING(500)
    },
    pnName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    pnState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    pnDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    pnDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = PromissoryModel