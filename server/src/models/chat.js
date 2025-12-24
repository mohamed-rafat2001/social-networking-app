const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    secondId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            secondId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]


}, { timestamps: true })
const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat