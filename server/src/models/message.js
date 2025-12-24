const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    file: [{
        public_id: String, secure_url: String

    }]
}, { timestamps: true })
const Message = mongoose.model('Message', messageSchema)
module.exports = Message