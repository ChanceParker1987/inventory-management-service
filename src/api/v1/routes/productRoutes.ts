import express, { Router } from "express";
import { validateRequest } from "../middleware/validateRequest";
import { productSchemas } from "../validation/productValidation";
import * as productController from "../controllers/productController";

const router: Router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post(
    "/",
    validateRequest(productSchemas.create),
    productController.createProduct
);

router.put(
    "/:id",
    validateRequest(productSchemas.update),
    productController.updateProduct
);

router.delete("/:id", productController.deleteProduct);

export default router;
