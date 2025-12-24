const Chat = require('../models/chat')
const User = require('../models/user')

const appError = require('../utils/appError')
const errorHandler = require('../middelwares/errorHandler')
//create chat
const createChat = errorHandler(
    async (req, res, next) => {
        const userId = req.user._id
        const secondId = req.body.secondId
        const findSecondId = await User.findById(secondId)
        if (!findSecondId) {
            const error = appError.Error('user not found', 'fail', 404)
            return next(error)
        }
        const findChat = await Chat.findOne({ members: { $elemMatch: { userId, secondId } } })
        if (findChat) {
            return res.status(200).json({ status: 'success', data: findChat })

        }
        const chat = await Chat({ members: { userId, secondId } })
        if (!chat) {
            const error = appError.Error('not create chat', 'fail', 404)
            return next(error)
        }
        await chat.save()
        res.status(200).json({ status: 'success', data: chat })
    }
)
const findChat = errorHandler(
    async (req, res, next) => {

        const _id = req.params.id
        const chat = await Chat.findById(_id).populate(['members.secondId', 'members.userId'])
        if (!chat) {
            const error = appError.Error('chat not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: chat })
    }
)
const findUserChats = errorHandler(
    async (req, res, next) => {
        const userId = req.user._id
        const chat = await Chat.find({
            members: {
                $elemMatch: {
                    $or: [{ userId }, { secondId: userId }]
                }
            }
        }).populate(['members.secondId', 'members.userId'])
        if (chat.length == 0) {
            const error = appError.Error('chats not found', 'fail', 404)
            return next(error)
        }

        res.status(200).json({ status: 'success', data: chat })

    }
)

const deleteChat = errorHandler(
    async (req, res, next) => {
        const userId = req.user._id
        const secondId = req.params.id
        const chat = await Chat.findOneAndDelete({ userId, secondId })
        if (!chat) {
            const error = appError.Error('chats not found', 'fail', 404)
            return next(error)
        }

        res.status(200).json({ status: 'success', data: chat })

    }
)
module.exports = {
    createChat,
    findChat,
    findUserChats,
    deleteChat
}