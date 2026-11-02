import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Product } from "../models/productModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "products";

/**
 * Retrieves all products from storage
 * @returns Array of all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const products: Product[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as Product;
        });

        return products;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new product
 * @param productData - The data for the new product 
 * @returns The created product with generated ID
 */
export const createProduct = async (productData: {
    name: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
}): Promise<Product> => {
    const dateNow = new Date();
    const newProduct: Partial<Product> = {
        ...productData,
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const productId: string = await createDocument<Product>(COLLECTION, newProduct);

    return structuredClone({ id: productId, ...newProduct } as Product);
};

/**
 * Retrieves a single product by ID from the database
 * @param id - This ID of the product to retrieve
 * @returns The product if found
 */
export const getProductById = async (id: string): Promise<Product> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc || !doc.exists) {
        throw new Error(`Product with ID ${id} not found`);
    }

    const data = doc.data();

    if (!data) {
        throw new Error(`Product with ID ${id} has no data`);
    }
    const product: Product = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    } as Product;

    return structuredClone(product);
};

/**
 * Updates (replaces) an existing product
 * @param id - The ID of the product to update
 * @param productData - The fields to updates 
 * @returns The updated product
 * @throws Error if product with given ID is not found
 */
export const updateProduct = async (
    id: string,
    productData: Partial<
        Pick<Product, "name" | "quantity" | "price" | "category">
    >
): Promise<Product> => {
    // check if the product exists before updating
    const product: Product = await getProductById(id);
    if (!product) {
        throw new Error(`Product with ID ${id} not found`);
    }

    const updatedProduct: Product = {
        ...product,
        updatedAt: new Date(),
    };

    if (productData.name !== undefined) updatedProduct.name = productData.name;
    if (productData.quantity !== undefined)
        updatedProduct.quantity = productData.quantity;
    if (productData.category !== undefined)
        updatedProduct.category = productData.category;
    if (productData.price !== undefined) updatedProduct.price = productData.price;

    await updateDocument<Product>(COLLECTION, id, updatedProduct);

    return structuredClone(updatedProduct);
};

/**
 * Deletes an product from storage
 * @param id - The ID of the product to delete
 * @throws Error if product with given ID is not found
 */
export const deleteProduct = async (id: string): Promise<void> => {
    // check if the product exists before deleting
    const product: Product = await getProductById(id);
    if (!product) {
        throw new Error(`Product with ID ${id} not found`);
    }

    await deleteDocument(COLLECTION, id);
};
