import express, { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { itemSchemas } from "../validation/productValidation";
import * as productController from "../controllers/productController";

const router: Router = express.Router();

router.get("/", productController.getAllProducts);
router.post(
    "/",
    validateRequest(itemSchemas.create),
    productController.createProduct
);
router.put(
    "/:id",
    validateRequest(itemSchemas.update),
    productController.updateProduct
);

export default router;
