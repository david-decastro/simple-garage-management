import { Router } from "express";
import filesRouter from "./FileRouter.js";
import carsRouter from "./CarRouter.js";
import inspectionsRouter from "./InspectionRouter.js";
import partsRouter from "./PartRouter.js";
import inspectionPartsRouter from "./InspectionPartRouter.js";
import externalAPIRouter from "./ExternalAPIRouter.js";

const router = Router();

router.use("/files", filesRouter);
router.use("/cars", carsRouter);
router.use("/inspections", inspectionsRouter);
router.use("/parts", partsRouter);
router.use("/inspection-parts", inspectionPartsRouter);

router.use("/external", externalAPIRouter);

export default router;
