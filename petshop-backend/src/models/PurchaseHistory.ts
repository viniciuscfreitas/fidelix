// src/models/PurchaseHistory.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class PurchaseHistory extends Model {
    public id!: number;
    public customerId!: number;
    public productId!: number;
    public quantity!: number;
    public totalAmount!: number;
    public purchaseDate!: Date;
}

PurchaseHistory.init(
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
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'PurchaseHistory',
        tableName: 'PurchaseHistories',
    }
);

export default PurchaseHistory;