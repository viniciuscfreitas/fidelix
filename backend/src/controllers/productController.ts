// src/controllers/productController.ts
import { Request, Response } from 'express';
import Product from '../models/Product';

// Função para criar um novo produto
export const createProduct = async (req: Request, res: Response) => {
    const { name, price, stock, category, description } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !price || stock === undefined) {
        return res.status(400).json({ error: 'Nome, preço e estoque são obrigatórios.' });
    }

    try {
        const product = await Product.create({ name, price, stock, category, description });
        res.status(201).json({ message: 'Produto criado com sucesso', product });
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
    const { name, price, stock, category, description } = req.body;

    // Verificação de campos obrigatórios
    if (stock === undefined) {
        return res.status(400).json({ error: 'O campo de estoque é obrigatório.' });
    }

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await product.update({ name, price, stock, category, description });
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