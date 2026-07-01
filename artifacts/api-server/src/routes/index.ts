import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import plansRouter from "./plans";
import servicesRouter from "./services";
import billingRouter from "./billing";
import ticketsRouter from "./tickets";
import announcementsRouter from "./announcements";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(plansRouter);
router.use(servicesRouter);
router.use(billingRouter);
router.use(ticketsRouter);
router.use(announcementsRouter);
router.use(dashboardRouter);
router.use(adminRouter);

export default router;
