import { Router } from "express"
import { login, signup } from "./authentication.service.js";
import { successResponse } from "../../common/utils/index.js";
const router = Router();

router.post("/signup", async(req,res,next) => {
    const data = await signup(req.body)
    return successResponse({res, status:201, data})
})

router.post("/login", async(req,res,next) => {
    const data = await login(req.body)
    return successResponse({res, data})
})

export default router