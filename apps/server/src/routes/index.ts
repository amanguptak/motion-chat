import { Router } from "express";

import userRoutes from "./userRoutes"

const router = Router()


router.use("/api",userRoutes)

export default router;