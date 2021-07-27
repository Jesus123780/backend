const graphqlFields = require('graphql-fields')
const { Base64 } = require('js-base64')

codeRed = async (model) => {
    /** variables necesarias */
    let result = '', error = false
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    /** creación de codigo */
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    /** busca si ya existe */
    const dataUP = await model.findOne({attributes: ['up_id'], where: {up_code: result}}).catch(x = error = true)
    /** verifica si existe */
    if (!!dataUP)
        await codeRed()
    else
        return result
}

enCode = value => {
    const v = ((((value * 998161) * 793927) * 562841) * 288413) / 472793
    return Base64.encode(`${v}`)
}

deCode = value => {
    const v = Base64.decode(value)
    return Math.round(((((v * 472793) / 288413) / 562841) / 793927) / 998161)
}

linkBelongsTo = (modelOne, modelTwo, target, foreign) => {
    return modelOne.belongsTo(modelTwo, {
        targetKey: target,
        foreignKey: foreign
    })
}

linkHasMany = (modelOne, modelTwo, target, foreign) => {
    return modelOne.hasMany(modelTwo, {
        targetKey: target,
        foreignKey: foreign
    })
}

consecutive = value => {
    let consecutive = parseInt(value) +1
    consecutive = `${consecutive}`
    if (consecutive.length === 4)
        consecutive = `00${consecutive}`
    else if (consecutive.length === 5)
        consecutive = `0${consecutive}`
    return consecutive
}

UpCrNotFind = async (model, newItem, where, condition, updateFind = false) => {
    /** confirma si hay id para actualizar o registrar */
    if (!!condition) {
        const data = await model.update(newItem, { where: !!where ? where : { [condition.id]: deCode(condition.value) } })
        if (!!data[0] && !!updateFind)
            return await model.findOne({ where: !!where ? where : { [condition.id]: deCode(condition.value) } })
        else
            return !!where ? where : { [condition.id]: condition.value }
    } else
        return await model.create(newItem)
}

UpCrFind = async (model, newItem, where, condition, updateFind = false) => {
    const res = await model.findOne({ where: where ? where : { [condition.id]: deCode(condition.value) } })
    /** confirma si hay id para actualizar o registrar */
    if (!!res) {
        const data = await model.update(newItem, { where: where ? where : { [condition.id]: deCode(condition.value) } })
        return res
    } else
        return await model.create(newItem)
}

updateOrCreate = async (model, newItem, where) => {
    /** busca si existe */
    const result = await model.findOne({ where })
    /** confirma si existe para actualizar o registrar */
    if (!!result) {
        const data = await model.update(newItem, { where })
        if (data[0] !== 0)
            return await model.findOne({ where })
        else
            return result
    } else
        return await model.create(newItem)
}

// Busca los campos que coinciden con la base de datos y la query de graphql
const getAttributes = (model, attributes) => {
    const rows = model.rawAttributes
    const columns = graphqlFields(attributes)
    return (Object.keys(columns?.data ? columns.data : columns)?.filter(x => rows[x]) || [])
}

const validationID = (value, typeNull = true) => {
    try {
        if (typeNull && isNull(value) && isNaN(Base64.decode(value))) throw new Error('No es una codificación valida.')
        else if (!typeNull && isNaN(value ? Base64.decode(value) : 0)) throw new Error('No es una codificación valida')
        return value ? deCode(value) : null
    } catch (error) {
        throw new Error('No es una codificación valida.')
    }
}

/**
 *
 * @param {Object} data objeto a filtrar
 * @param {Array} filters array a comparar o claves del objeto
 * @return {Object} devuelve un objeto con los datos filtrados
 */
 const filterKeyObject = (data, filters) => {
    let values = {}
    for (const elem in data) {
        let coincidence = false
        for (let i = 0; i < filters.length; i++) if (elem === filters[i]) coincidence = true

        if (!coincidence) values = { ...values, [elem]: data[elem] }
    }

    return values
}

module.exports = {
    enCode,
    deCode,
    consecutive,
    codeRed,
    // pushNotifications,
    UpCrNotFind,
    UpCrFind,
    linkBelongsTo,
    linkHasMany,
    updateOrCreate,
    getAttributes,
    validationID,
    filterKeyObject
}