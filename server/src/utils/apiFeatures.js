class apiFeatures {
    constructor(model, query) {
        this.model = model
        this.query = query
    }
    paginate() {
        let limit = +this.query.limit * 1 || 2
        let page = +this.query.page * 1 || 1
        if (page < 0) page = -page
        if (limit < 0) limit = -limit
        const skip = (page - 1) * limit
        this.model.skip(skip).limit(limit)
        return this
    }
}
module.exports = apiFeatures