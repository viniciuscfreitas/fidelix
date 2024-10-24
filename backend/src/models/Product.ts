// src/models/Product.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Product extends Model {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public stock!: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'Products',
    }
);

export default Product;