import controller from "../controllers/InspectionPartController.js";
import { Router } from "express";
import { paginationMiddleware } from "../common/paginationUtils.js";

const router = Router();

router.get("", paginationMiddleware, controller.findAll);

router.post("", controller.save);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
