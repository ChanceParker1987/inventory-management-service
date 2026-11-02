
import Joi from "joi";
import { RequestSchema } from "../middleware/validateRequest";

export const productSchemas: Record<string, RequestSchema> = {
    // POST /api/v1/products
    create: {
        body: Joi.object({
            name: Joi.string().min(2).max(80).required(),
            sku: Joi.string()
                .pattern(/^[A-Z]{3}\d{4}$/)
                .required(),
            quantity: Joi.number().integer().min(0).required(),
            price: Joi.number().positive().precision(2).strict().required(),
            category: Joi.string()
                .valid("electronics", "clothing", "food", "tools", "other")
                .required(),
        }),
    },

    // PUT /api/v1/products/:id
    update: {
        params: Joi.object({
            id: Joi.string().required(),
        }),
        body: Joi.object({
            name: Joi.string().min(2).max(80).optional(),
            quantity: Joi.number().integer().min(0).optional(),
            price: Joi.number().positive().precision(2).strict().optional(),
            category: Joi.string()
                .valid("electronics", "clothing", "food", "tools", "other")
                .optional(),
        }),
    },
};
