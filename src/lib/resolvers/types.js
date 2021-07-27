const { foldersParentTypes } = require('./folderParents')
const { employeesTypes } = require('./employees')
const { employeeFolderParentsTypes } = require('./employeeFolderParents')
const { areasTypes } = require('./featuresProducts')
const { moduleTypes } = require('./modules')
const { subModuleTypes } = require('./submodules')
const { fileUploadTypes } = require('./fileUpload')
const { storageTypes } = require('./storage')
const { clientsTypes } = require('./products')
const { lawyersTypes } = require('./lawyers')
const { requirementTypes } = require('./requirements')
const { generalFolderParentsTypes } = require('./generalFolderParents')
const { countriesTypes } = require('./informations/Countries')
const { pqrQueriesType } = require('./pqr/transporter')

module.exports = {
    ...areasTypes,
    ...clientsTypes,
    ...employeesTypes,
    ...employeeFolderParentsTypes,
    ...fileUploadTypes,
    ...foldersParentTypes,
    ...generalFolderParentsTypes,
    ...lawyersTypes,
    ...moduleTypes,
    ...requirementTypes,
    ...subModuleTypes,
    ...storageTypes,
    ...countriesTypes,
    ...pqrQueriesType,
}