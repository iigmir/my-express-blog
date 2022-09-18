import { Router } from "express";
import { RootRoute, MainRoute } from "../controllers/article.v1.js";

const router = Router();

router.get( `/`, RootRoute );
router.get( `/:id`, MainRoute );

export default router;
