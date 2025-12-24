const Message = require('../models/message')
const cloudinary = require('../utils/cloudinary')

const appError = require('../utils/appError')
const errorHandler = require('../middelwares/errorHandler')

// create message
const createMessage = errorHandler(
    async (req, res, next) => {

        const senderId = req.user._id
        const chatId = req.params.id
        if (!chatId) {
            const error = appError.Error('no chat founded', 'fail', 404)
            return next(error)
        }
        if (req.files) {
            const files = []
            for (const file of req.files) {
                const { public_id, secure_url } = await cloudinary.uploader.upload(file.path,
                    { folder: `e-Learning/user/userId_${req.user._id}/chatId_${chatId}`, })
                files.push({ public_id, secure_url })
            }
            var message = new Message({ ...req.body, senderId, chatId, file: files })
        }
        if (!req.files) {
            var message = new Message({ ...req.body, senderId, chatId })

        }
        if (!message) {
            const error = appError.Error('messgae not sended', 'fail', 404)
            return next(error)
        }
        await message.save()
        res.status(200).json({ status: 'success', data: message })
    }
)

//chat messgaes
const ChatMessages = errorHandler(
    async (req, res, next) => {
        const chatId = req.params.id
        const message = await Message.find({ chatId })
        if (!message) {
            const error = appError.Error('messages not founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: message })
    }
)
const deleteMessage = errorHandler(
    async (req, res, next) => {
        const messageId = req.params.id
        const message = await Message.findByIdAndDelete(messageId)
        if (!message) {
            const error = appError.Error('message not deleted or not founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: message })
    }
)
const deleteAllMessagesFromChat = errorHandler(
    async (req, res, next) => {
        const chatId = req.params.id
        const senderId = req.user._id
        const message = await Message.find({ chatId, senderId }).deleteMany()
        if (!message) {
            const error = appError.Error('messages not deleted or not founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: message })
    }
)
module.exports = {
    createMessage,

    deleteMessage,
    deleteAllMessagesFromChat,
    ChatMessages
}