// src/controllers/productController.ts
import { Request, Response } from 'express';
import Product from '../models/Product';

// Função para criar um produto
export const createProduct = async (req: Request, res: Response) => {
    const { name, description, price, stock } = req.body;

    try {
        const newProduct = await Product.create({ name, description, price, stock });
        res.status(201).json({ message: 'Produto criado com sucesso', product: newProduct });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

// Função para obter todos os produtos
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ products });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};

// Função para atualizar um produto
export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.stock = stock;
        await product.save();

        res.status(200).json({ message: 'Produto atualizado com sucesso', product });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

// Função para deletar um produto
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};

// Função para buscar um produto por ID
export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
};