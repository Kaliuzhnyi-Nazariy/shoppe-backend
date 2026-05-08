import { Router } from "express";
import { isAuthenticated, validateBody } from "../middlewares";
import ctrl from "../controllers/addresses";
import { addressValidation } from "../validation/address.validation";

const router = Router();

router.get("/all", isAuthenticated, ctrl.getAddresses);

router.get("/:addressId", isAuthenticated, ctrl.getAddressById);

router.post(
  "/add",
  isAuthenticated,
  validateBody(addressValidation),
  ctrl.addAddress,
);

router.put(
  "/update/:addressId",
  isAuthenticated,
  validateBody(addressValidation),
  ctrl.updateAddress,
);

router.delete("/:addressId", isAuthenticated, ctrl.deleteAddress);

export default router;
