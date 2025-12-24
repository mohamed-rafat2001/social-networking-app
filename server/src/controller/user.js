const User = require('../models/user')
const Posts = require('../models/posts')
const Share = require('../models/sharePost')
const bcryptjs = require('bcryptjs')
const errorHandler = require('../middelwares/errorHandler')
const appError = require('../utils/appError')
const Email = require('../utils/sendEmail')
const cloudinary = require('../utils/cloudinary')
const apiFeatures = require('../utils/apiFeatures')
const singUp = errorHandler(
    async (req, res, next) => {
        const user = new User(req.body)
        if (!user) {
            const error = appError.Error('email or password is wrong', 'fail', 404)
            return next(error)
        }
        const token = user.creatToken()
        await user.save()
        res.status(200).json({ status: 'success', data: { user, token } })

    })
const profileImg = errorHandler(
    async (req, res, next) => {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
            { folder: `e-Learning/user/id_${req.user._id}/profileImg` })
        req.user.image = { public_id, secure_url }
        await req.user.save()
        res.status(200).json({ status: 'success', data: req.user })
    })
const login = errorHandler(
    async (req, res, next) => {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (!user) {
            const error = appError.Error('email or password is wrong', 'fail', 404)
            return next(error)
        }
        const pass = await bcryptjs.compare(req.body.password, user.password)
        if (!pass) {
            const error = appError.Error('email or password is wrong', 'fail', 404)
            return next(error)
        }
        const token = user.creatToken()
        res.status(200).json({ status: 'success', data: { user, token } })

    }
)

const profile = errorHandler(
    async (req, res, next) => {
        const query = req.query

        let share = new apiFeatures(Share.find({ userId: req.user._id }), query).paginate()
        let posts = new apiFeatures(Posts.find({ userId: req.user._id }), query).paginate()
        posts = await posts.model
        share = await share.model.populate('sharePost')
        // const shares = []
        // for (const sh of share) {
        //     const shareOb = sh.toObject()
        //     delete shareOb.sharePost.__v
        //     delete shareOb.userId.email
        //     delete shareOb.userId.password
        //     delete shareOb.userId.role
        //     delete shareOb.userId.block
        //     delete shareOb.userId.__v
        //     delete shareOb.__v
        //     shares.push(shareOb)
        // }
        if (share.length == 0 || posts.length == 0) {
            const error = appError.Error('no posts founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: { posts: [...share, ...posts] } })
    }
)
const updateProfile = errorHandler(
    async (req, res, next) => {
        const updates = Object.keys(req.body)
        updates.forEach(el => req.user[el] = req.body[el]);
        await req.user.save()
        res.status(200).json({ status: 'success', data: req.user })
    }
)
const deleteAcount = errorHandler(
    async (req, res, next) => {
        const user = await User.deleteOne(req.user)
        if (!user) {
            const error = appError.Error('user not founded', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: user })

    }
)
const forgotPass = errorHandler(
    async (req, res, next) => {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (user) {
            Email(user)
        }
        await user.save()
        res.status(200).json({ status: 'success', data: "please check your email" })

    }
)
const resetPassword = errorHandler(
    async (req, res, next) => {
        const passwordResetToken = req.body.code
        const user = await User.findOne({ passwordResetToken })
        if (!user) {
            const error = appError.Error('invalid code', 'fail', 500)
            return next(error)
        }
        user.password = req.body.password
        user.passwordResetToken = ""
        const token = user.creatToken()
        await user.save()
        res.status(200).json({ status: 'success', data: { user, token } })
    }
)
const user = errorHandler(
    async (req, res, next) => {
        if (!req.user) {
            const error = appError.Error('no user', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: req.user })
    }
)
module.exports = {
    singUp,
    profileImg,
    login,
    profile,
    updateProfile,
    deleteAcount,
    forgotPass,
    resetPassword,
    user
}