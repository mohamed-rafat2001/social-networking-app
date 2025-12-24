const Share = require('../models/sharePost')
const errorHandler = require('../middelwares/errorHandler')
const cloudinary = require('../utils/cloudinary')
const appError = require('../utils/appError')
const Post = require('../models/posts')

const sharePost = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        if (req.files) {
            const files = []
            for (const file of req.files) {
                const { public_id, secure_url } = await cloudinary.uploader.upload(file.path,
                    { folder: `e-Learning/user/id_${req.user._id}/share/postId_${postId}` })
                files.push({ public_id, secure_url })
            }

            var sharePO = new Share({ ...req.body, userId: _id, sharePost: postId, image: files })
            await Post.findByIdAndUpdate(postId, {
                $push: { shares: { shareId: sharePO._id, userId: _id } },
                $inc: { views: 1 }
            }, { new: true })
        }
        if (!req.files) {
            var sharePO = new Share({ ...req.body, userId: _id, sharePost: postId })
            await Post.findByIdAndUpdate(postId, {
                $push: { shares: { shareId: sharePO._id, userId: _id } },
                $inc: { views: 1 }
            }, { new: true })

        }
        if (!sharePO) {
            const error = appError.Error('not shared', 'fail', 404)
            return next(error)
        }
        await sharePO.save()
        res.status(200).json({ status: 'success', data: sharePO })
    }
)
const deleteShare = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        const sharePO = await Share.findOneAndDelete({ userId: _id, sharePost: postId })
        if (!sharePO) {
            const error = appError.Error('not deleted', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: sharePO })
    }
)
const updateShare = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        const sharePO = await Share.findOneAndUpdate({ userId: _id, sharePost: postId }, req.body, { new: true })
        if (!sharePO) {
            const error = appError.Error('not updated', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: sharePO })
    }
)
const singleShare = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        const sharePO = await Share.findOne({ userId: _id, sharePost: postId })
        if (!sharePO) {
            const error = appError.Error('not founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: sharePO })
    }
)
module.exports = {
    sharePost,
    deleteShare,
    updateShare,
    singleShare,
}