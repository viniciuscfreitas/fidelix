// src/models/Customer.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Customer extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public phoneNumber!: string;
    public address!: string;
}

Customer.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Customer',
        tableName: 'Customers',
    }
);

export default Customer;