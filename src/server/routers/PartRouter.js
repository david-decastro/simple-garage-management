import controller from "../controllers/PartController.js";
import { paginationMiddleware } from "../common/paginationUtils.js";
import { Router } from "express";
import { filtersMiddleware } from "../common/filtersMiddleware.js";

const router = Router();

router.get("", paginationMiddleware, filtersMiddleware, controller.findAll);
router.get("/:id", controller.find);
router.get("/:id/image", controller.getImage);

router.post("", controller.save);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
