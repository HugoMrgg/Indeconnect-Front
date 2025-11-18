// exemples d'utilisation axios pour interagir avec une API RESTful pour la gestion des produits

import api from "../api.ts";
import { Product } from "src/types/Product";

export const productsService = {
    async getAll(): Promise<Product[]> {
        const { data } = await api.get("/products");
        return data;
    },

    async getById(id: string): Promise<Product> {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    async create(payload: Partial<Product>): Promise<Product> {
        const { data } = await api.post("/products", payload);
        return data;
    },
};
