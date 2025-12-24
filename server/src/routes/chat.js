const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const {
    createChat,
    findChat,
    findUserChats,
    deleteChat } = require('../controller/chat')
router.route('/chats').post(auth.user, createChat).get(auth.user, findUserChats)
router.route('/chat/:id').get(auth.user, findChat).delete(auth.user, deleteChat)
module.exports = router