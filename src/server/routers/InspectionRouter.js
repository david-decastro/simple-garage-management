import controller from "../controllers/InspectionController.js";
import { paginationMiddleware } from "../common/paginationUtils.js";
import { Router } from "express";

const router = Router();

router.get("", paginationMiddleware, controller.findAll);
router.get("/:id", controller.find);
router.get("/:id/parts", paginationMiddleware, controller.findParts);
router.get("/:id/invoice", controller.getInvoice);

router.post("", controller.save);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
