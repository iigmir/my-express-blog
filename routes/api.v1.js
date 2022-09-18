import { Router } from "express";
import { RootRoute, MainRoute } from "../controllers/api.v1.js";

const router = Router();
const VERSION = "v1";

router.get( `/${VERSION}`, RootRoute);
router.get( `/${VERSION}/:id`, MainRoute);

export default router;
