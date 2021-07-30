const { folderMutation } = require('./folders')
const { folderParentsMutation } = require('./folderParents')
const { employeeRequirementsMutation } = require('./employeeRequirements')
const { employeeMutations } = require('./employees')
const { employeeFoldersMutations } = require('./employeeFolders')
const { employeeFolderParentsMutations } = require('./employeeFolderParents')
const { userMutations } = require('./users')
const { moduleMutations } = require('./modules')
const { subModuleMutations } = require('./submodules')
const { userPermitsMutations } = require('./userPermits')
const { fileUploadMutations } = require('./fileUpload')
const { thirdPartiesMutations } = require('./thirdParties')
const { storageMutations } = require('./storage')
const { lawyersMutations } =require('./lawyers')
const { areasMutations } = require('./featuresProducts')
const { requirementMutations } = require('./requirements')
const { generalFoldersMutations } = require('./GeneralFolders')
const { generalFolderParentsMutations } = require('./generalFolderParents')
const { generalDocumentsMutation } = require('./generalDocuments')
const { registerUserMutation, loginMutation, updateAvatar, UpdateInfo } = require('./userLogin')
const { typeIdentitiesMutation } = require('./informations/TypeIdentities')
const { colorMutation } = require('./informations/Color')
const { sizeMutation } = require('./informations/Size')
const { ProductMutations } = require('./products/index')
const { departmentsMutation } = require('./informations/Departments')
const { countriesMutation } = require('./informations/Countries')
const { citiesMutation } = require('./informations/Cities')
const { informationMutation } = require('./informations')
const { createRoadMutation } = require('./informations/RoadType')

module.exports = {
    ...areasMutations,
    ...employeeMutations,
    ...employeeFoldersMutations,
    ...employeeFolderParentsMutations,
    ...employeeRequirementsMutation,
    ...folderMutation,
    ...folderParentsMutation,
    ...fileUploadMutations,
    ...generalDocumentsMutation,
    ...generalFoldersMutations,
    ...generalFolderParentsMutations,
    ...lawyersMutations,
    ...moduleMutations,
    ...requirementMutations,
    ...subModuleMutations,
    ...storageMutations,
    ...thirdPartiesMutations,
    ...userMutations,
    ...userPermitsMutations,
    ...registerUserMutation,
    ...loginMutation,
    ...updateAvatar,
    ...UpdateInfo,
    ...typeIdentitiesMutation,
    ...colorMutation,
    ...sizeMutation,
    ...ProductMutations,
    ...departmentsMutation,
    ...countriesMutation,
    ...citiesMutation,
    ...informationMutation,
    ...createRoadMutation,
}