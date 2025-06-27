import controller from "../controllers/ExternalAPIController.js";
import { Router } from "express";

const router = Router();

router.get("/brands", controller.findAllBrands);
router.get("/models", controller.findAllModels);

export default router;
