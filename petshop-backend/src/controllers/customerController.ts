// src/controllers/customerController.ts
import { Request, Response } from 'express';
import Customer from '../models/Customer';

// Função auxiliar para buscar um cliente por ID
const findCustomerById = async (id: string) => {
    return await Customer.findByPk(id);
};

// Função para cadastrar um novo cliente
export const createCustomer = async (req: Request, res: Response) => {
    const { name, email, phoneNumber, address } = req.body;

    if (!name || !email || !phoneNumber || !address) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        // Verificar se o e-mail já está em uso
        const existingCustomer = await Customer.findOne({ where: { email } });
        if (existingCustomer) {
            return res.status(400).json({ error: 'E-mail já está em uso' });
        }

        const newCustomer = await Customer.create({ name, email, phoneNumber, address });
        res.status(201).json({ message: 'Cliente cadastrado com sucesso', customer: newCustomer });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
};

// Função para obter todos os clientes
export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json({ customers });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
};

// Função para obter um cliente por ID
export const getCustomerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer = await findCustomerById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.status(200).json({ customer });
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
};

// Função para atualizar um cliente
export const updateCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phoneNumber, address } = req.body;

    try {
        const customer = await findCustomerById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Verificar se o e-mail está sendo atualizado e se já está em uso por outro cliente
        if (email && email !== customer.email) {
            const existingCustomer = await Customer.findOne({ where: { email } });
            if (existingCustomer) {
                return res.status(400).json({ error: 'E-mail já está em uso por outro cliente' });
            }
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;
        customer.address = address || customer.address;
        await customer.save();

        res.status(200).json({ message: 'Cliente atualizado com sucesso', customer });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};

// Função para excluir um cliente
export const deleteCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const customer = await findCustomerById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        await customer.destroy();
        res.status(200).json({ message: 'Cliente excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
};