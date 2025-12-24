const { validationResult } = require('express-validator')
const handelValidation = () => {
    return (req, res, next) => {
        const result = validationResult(req)
        if (result.errors.length) {
            return res.status(400).json({ status: 'error', message: 'validation err', validation: result.errors })
        }
        next()
    }
}
module.exports = handelValidation