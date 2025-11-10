// exemples d'utilisation axios pour interagir avec une API RESTful pour la gestion des produits

import axiosClient from "../http/axiosClient";
import { Product } from "@/types/Product";

export const productsService = {
    async getAll(): Promise<Product[]> {
        const { data } = await axiosClient.get("/products");
        return data;
    },

    async getById(id: string): Promise<Product> {
        const { data } = await axiosClient.get(`/products/${id}`);
        return data;
    },

    async create(payload: Partial<Product>): Promise<Product> {
        const { data } = await axiosClient.post("/products", payload);
        return data;
    },
};
