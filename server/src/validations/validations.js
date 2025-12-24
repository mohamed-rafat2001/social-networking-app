const { body } = require('express-validator')
const regestrationValidator = [
    body('firstName').isString().isLength({ min: 3, max: 20 }).trim().isLowercase().withMessage('in-valid firstName'),
    body('lastName').isString().isLength({ min: 3, max: 20 }).trim().isLowercase().withMessage('in-valid lastName'),
    body('email').trim().isEmail().withMessage('in-valid email'),
    body('password').isStrongPassword({ minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage(
            "in-valid password"),
    body('idNumber').isInt().isLength({ min: 8, max: 8 })

]
// 'must password have minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 '),
const fileValidation = {
    image: ['image/jpg', 'image/jpeg ', 'image/png', 'image/jfif'],
    file: ['application/pdf', 'application/wsword'],
    sdk: ['video/mp4', 'audio/mp3']
}
module.exports = {
    regestrationValidator,
    fileValidation
}