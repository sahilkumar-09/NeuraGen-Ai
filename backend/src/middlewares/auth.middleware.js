import { AsyncHandler } from "../service/AsyncHandler.service.js";
import { ApiError } from "../service/ApiError.service.js"
import jwt from 'jsonwebtoken'
import users from "../models/user.model.js"

const authMiddleware = AsyncHandler(async (req, res, next) => {
    const token = req.cookies.token || req.header.authorization?.replace("Bearer", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)


    req.user = decoded
    next()
})

export {
    authMiddleware
}