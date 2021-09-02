const { folderQueries } = require('./folders')
const { folderParentsQueries } = require('./folderParents')
const { employeeRequirementsQueries } = require('./employeeRequirements')
const { employeesQueries } = require('./employees')
const { employeeFoldersQueries } = require('./employeeFolders')
const { employeeFolderParentsQueries } = require('./employeeFolderParents')
const { areasQueries, getAreasQueries } = require('./area')
const { userQueries } = require('./users')
const { moduleQueries } = require('./modules')
const { subModuleQueries } = require('./submodules')
const { userPermitsQueries } = require('./userPermits')
const { fileUploadQueries } = require('./fileUpload')
const { thirdPartiesQueries } = require('./thirdParties')
const { storageQueries } = require('./storage')
const { storageTypesQueries } = require('./storageTypes')
const { informationQueries } = require('./informations')
const { lawyersQueries } = require('./lawyers')
const { requirementQueries } = require('./requirements')
const { generalFolderParentsQueries } = require('./generalFolderParents')
const { generalFoldersQueries } = require('./GeneralFolders')
const { generalDocumentsQueries } = require('./generalDocuments')
const { getUser } = require('./userLogin')
const { colorQueries } = require('./informations/Color')
const { trademarkQueries } = require('./trademark')
const { pqrQueriesT } = require('./pqr/transporter')
const { departmentsAllQueries } = require('./informations/Departments')
const { citiesQueriesAll } = require('./informations/Cities')
const { ProductQueries } = require('./product')
const { featureQueries } = require('./feature')
const { featureTypeQueries } = require('./feature/featureType')
const { CategoriesProductQueries } = require('./Category')

module.exports = {
    ...areasQueries,
    ...employeesQueries,
    ...employeeFoldersQueries,
    ...employeeFolderParentsQueries,
    ...employeeRequirementsQueries,
    ...folderQueries,
    ...folderParentsQueries,
    ...fileUploadQueries,
    ...generalDocumentsQueries,
    ...generalFolderParentsQueries,
    ...generalFoldersQueries,
    ...informationQueries,
    ...lawyersQueries,
    ...moduleQueries,
    ...requirementQueries,
    ...subModuleQueries,
    ...storageQueries,
    ...storageTypesQueries,
    ...thirdPartiesQueries,
    ...userQueries,
    ...userPermitsQueries,
    ...getUser,
    ...colorQueries,
    ...trademarkQueries,
    ...pqrQueriesT,
    ...departmentsAllQueries,
    ...citiesQueriesAll,
    ...ProductQueries,
    ...featureQueries,
    ...getAreasQueries,
    ...featureTypeQueries,
    ...CategoriesProductQueries,
}