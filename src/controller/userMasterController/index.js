const bcrypt = require('bcryptjs');
const UserMasters = require('../../models/userMaster/userMasterModel');
const deCode = require('../../utils');

async function UpdateUserMaster(input, context) {
    if (input.currentPassword) {
        // Obtener variables
        const { currentPassword, newPassword } = input
        // Verificar que exista el usuario
        const user = await UserMasters.findOne({ attributes: ['IdM', 'umSeCredential'], where: { IdM: deCode.deCode(context.UserMasters.IdM) } })
        // Comparar contraseña
        const compare = await bcrypt.compare(currentPassword, user.password)
        if (!compare) return 'La contraseña actual no es correcta.'
        // Comparar contraseña Y verifica que no sea Igual que a la anterior
        const compareNew = await bcrypt.compare(newPassword, user.password)
        if (compareNew) return 'La nueva contraseña no puede ser igual a la actual.'
        // Hash de contraseña
        const newPassHash = await bcrypt.hash(newPassword, 10)
        // Actualiza la contraseña
        await UserMasters.update({ password: newPassHash }, { where: { IdM: deCode.deCode(context.UserMasters.IdM) } })
        // Registro correcto
        return 'Se ha actualizado la contraseña con éxito.'
    } else if (input.uPhoNum) {
        await UserMasters.findOne({ attributes: ['IdM', 'umSeCredential'], where: { IdM: deCode.deCode(context.UserMasters.IdM) } })
        await UserMasters.update({ uPhoNum: input.uPhoNum }, { where: { IdM: deCode.deCode(context.UserMasters.IdM) } })
        // Registro correcto
        return `Operación exitosa, ahora tu numero es:  ${ input.uPhoNum }`
    }
    else {
        const error = new Error('Lo sentimos, ha ocurrido un error interno')
        return error
    }

}

async function RegisterUserMaster(input, context) {
    console.log(input)

}

module.exports = {
    RegisterUserMaster,
    UpdateUserMaster,
}