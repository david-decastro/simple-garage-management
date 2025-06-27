import controller from "../controllers/CarController.js";
import { paginationMiddleware } from "../common/paginationUtils.js";
import { Router } from "express";

const router = Router();

router.get("", paginationMiddleware, controller.findAll);
router.get("/basic", paginationMiddleware, controller.findAllBasic);
router.get("/:id", controller.find);
router.get("/:id/image", controller.getImage);

router.post("", controller.save);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
