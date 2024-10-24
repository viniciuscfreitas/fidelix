// src/models/Order.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Corrigido para 'default'

class Order extends Model {
    public id!: number;
    public customerId!: number;
    public products!: string;
    public totalPrice!: number;
    public purchaseDate!: Date;
    public category?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        products: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize, // Referência ao sequelize configurado
        modelName: 'Order',
        tableName: 'Orders',
    }
);

export default Order;