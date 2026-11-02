import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";
import * as productService from "../services/productService";
import { Product } from "../models/productModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and responses to retrieve all Products
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const products: Product[] = await productService.getAllProducts();
        res.status(HTTP_STATUS.OK).json(
            successResponse(products, "Products successfully retrieved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, responses, and validation to create a Product
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract only the fields we want (destructuring)
        const { name, sku, quantity, price, category } = req.body;

        const newProduct: Product = await productService.createProduct({
            name,
            sku,
            quantity,
            price,
            category
        });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newProduct, "Product created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and responses to update a Product
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id as string;
        const id = req.params.id as string;

        // Extract update fields
        const { name, quantity, price, category } = req.body;

        // create the update product object with the fields to be updated
        const updatedProduct: Product = await productService.updateProduct(id, {
            name,
            quantity,
            price,
            category
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedProduct, "Product updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        const product = await productService.getProductById(id);

        res.status(200).json(
            successResponse(product, "Product retrieved successfully")
        );
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("not found")) {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = req.params.id as string;
        await productService.deleteProduct(id);

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("not found")) {
            res.status(404).json({ error: error.message });
            return;
        }
        next(error);
    }
};
