import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { PaymentController } from "./payment.controller";

const router= Router()
router.get("/payments", auth([UserRoles.Admin]), PaymentController.getAllPayment);
export const PaymentRouter= router