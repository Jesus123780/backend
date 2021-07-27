const AWS = require('aws-sdk')

const awsGetFiles = async ({ accessKeyId, secretAccessKey, Bucket, Key }) => {
    let urlFile = undefined
    let error = undefined
    let S3 = {}

    try {
        S3 = new AWS.S3({
            accessKeyId,
            secretAccessKey
        })
        
    } catch (err) {
        error = err
    }
    await S3.getObject({
        Key,
        Bucket
    }).promise().then(res => {
        let dataType = ''
        if (Key.includes('.png')) dataType = 'image/png'
        if (Key.includes('.pdf')) dataType = 'application/pdf'
        if (Key.includes('.jpg')) dataType = 'image/jpeg'
        if (Key.includes('.jpeg')) dataType = 'image/jpeg'
        if (Key.includes('.svg')) dataType = 'image/svg'

        urlFile = `data:${ dataType };base64,${ res.Body.toString('base64') }`

    }).catch(err => {
        error = err
    })

    return { urlFile, error }
}

module.exports = {
    awsGetFiles
}