// src/models/Delivery.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Delivery extends Model {
    public id!: number;
    public customerId!: number;
    public address!: string;
    public deliveryDate!: Date;
    public items!: string[];
    public status!: string;
}

Delivery.init(
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
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        items: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Pendente',
        },
    },
    {
        sequelize,
        modelName: 'Delivery',
        tableName: 'Deliveries',
    }
);

export default Delivery;