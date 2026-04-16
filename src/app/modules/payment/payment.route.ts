import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../middleware/auth.const";
import { PaymentController } from "./payment.controller";

const router= Router()
router.get("/payments", auth([UserRoles.Admin]), PaymentController.getAllPayment);

router.patch(
    "/payments/:paymentId/status",
    auth([UserRoles.Admin]),
    PaymentController.updatePaymentStatus
  );
export const PaymentRouter= router