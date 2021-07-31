const { foldersParentTypes } = require('./folderParents')
const { employeesTypes } = require('./employees')
const { employeeFolderParentsTypes } = require('./employeeFolderParents')
const { areasTypes } = require('./featuresProducts')
const { moduleTypes } = require('./modules')
const { subModuleTypes } = require('./submodules')
const { fileUploadTypes } = require('./fileUpload')
const { storageTypes } = require('./storage')
const { lawyersTypes } = require('./lawyers')
const { requirementTypes } = require('./requirements')
const { generalFolderParentsTypes } = require('./generalFolderParents')
const { pqrQueriesType } = require('./pqr/transporter')
const { ProductTypes } = require('./product')

module.exports = {
    ...areasTypes,
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
    ...pqrQueriesType,
    ...ProductTypes,
}