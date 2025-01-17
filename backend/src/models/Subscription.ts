// src/models/Subscription.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Subscription extends Model {
    public id!: number;
    public customerId!: number;
    public productId!: number;
    public frequency!: string;
    public nextDeliveryDate!: Date;
    public status!: string;
}

Subscription.init({
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
    frequency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nextDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Ativa',
    },
}, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'Subscriptions',
    timestamps: true,
});

export default Subscription;